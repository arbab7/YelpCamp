const mongoose = require('mongoose');

const Schema = mongoose.Schema();

const ImageSchema = new mongoose.Schema({
    url: String,
    fileName: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true}};

const CampgroundSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    images: [ImageSchema],
    price:{
        type: Number,
        required:true,
        min: 0
    },
    description: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts)

CampgroundSchema.virtual('properties.popUpMarkUp').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`; 
});

const Campground = new mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;