const Review = require('../models/review');
const Campground = require("../models/campground");

module.exports.addReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const {rating, body} = req.body
    const review = new Review({rating, body, author: req.user._id});
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    req.flash('success', 'Added a new review!')
    res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.deleteReview = async(req, res, next) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted a review')
    res.redirect(`/campgrounds/${id}`);
}