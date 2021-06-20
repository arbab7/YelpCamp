const Campground = require("../models/campground");
const Review = require('../models/review')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxToken});

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}

module.exports.new = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.create = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    req.body.geometry =  geoData.body.features[0].geometry
    const campground = new Campground(req.body);
    campground.images = req.files.map(f => ({url: f.path, fileName: f.filename}))
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', "Successfully made a campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.show = async(req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
}).populate('author');
    if(!campground){
        req.flash("error", "Couldn't find the campground")
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show", {campground})
}

module.exports.edit = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", {campground})
}

module.exports.update = async (req, res, next) => {
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, {runValidators: true, new: true});
    const newImages = req.files.map(f => ({url: f.path, fileName: f.filename}))
    campground.images.push(...newImages);
    await campground.save();
    if(req.body.deleteImages){
        for(let fileName of req.body.deleteImages){
            await cloudinary.uploader.destroy(fileName);
        }
        await campground.updateOne({$pull: {images: {fileName: {$in: req.body.deleteImages}}}})
    }
    
    req.flash('success', 'Successfully updated campground!');
    res.redirect("/campgrounds/" + req.params.id)
}

module.exports.delete = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    for (const reviewId of campground.reviews) {
        await Review.findByIdAndDelete(reviewId);
    }
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect("/campgrounds");
}