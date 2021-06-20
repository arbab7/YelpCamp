const Campground = require("./models/campground");
const Review = require('./models/review')
const { campgroundSchema, reviewSchema} = require("./schemas");
const ExpressError = require('./utils/ExpressError')

module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const{error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in')
        return res.redirect('/login')
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash("error", "Couldn't find the campground")
        return res.redirect('/campgrounds')
    }
    if(!(campground.author.equals(req.user._id))){
        req.flash('error', "You are not allowed to do that")
        return res.redirect('/campgrounds')
    } 
    next();
  
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review){
        req.flash("error", "Couldn't find the review")
        return res.redirect('/campgrounds')
    }
    if(!(review.author.equals(req.user._id))){
        req.flash('error', "You are not allowed to do that")
        return res.redirect('/campgrounds')
    } 
    next();
}