const mongoose = require('mongoose');
const path = require('path');

const Campground = require(path.join(__dirname, '../models/campground'));

mongoose.connect('mongodb://localhost:27017/YelpCamp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log("Mongo connected")
    })
    .catch(e => {
        console.log(console.log("error"), e);
    })

const cities = require(path.join(__dirname, 'cities'));
const descriptors = require(path.join(__dirname, 'seedHelpers')).descriptors;
const places = require(path.join(__dirname, 'seedHelpers')).places;

const genRandNum = num => Math.floor(Math.random() * num);
const sample = array => array[genRandNum(array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 200; i++){
        const location = cities[genRandNum(1000)];
        const campground = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {                   
                    url: 'https://res.cloudinary.com/arbab/image/upload/v1622548371/YelpCamp/yxcjakq3chaj6l7di3ak.jpg',
                    fileName: 'YelpCamp/yxcjakq3chaj6l7di3ak'
                  },
                  {
                    url: 'https://res.cloudinary.com/arbab/image/upload/v1622548376/YelpCamp/l9uh2bs8deml0hyjuqwb.jpg',
                    fileName: 'YelpCamp/l9uh2bs8deml0hyjuqwb'
                  }
              
            ],
            location: `${location.city}, ${location.state}`,
            price: genRandNum(20) + 10,
            geometry:  { coordinates : [ location.longitude, location.latitude ], type : "Point" },
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sapien justo, iaculis ac ante sit amet, pharetra rhoncus nisl. In gravida gravida sapien et condimentum. In hac habitasse platea dictumst. Vivamus sed arcu venenatis, maximus sem vulputate, facilisis odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nisl velit, aliquam eget tincidunt ut, finibus eu odio. Curabitur faucibus quam quis nisi elementum, at tempor urna maximus. Pellentesque imperdiet euismod vehicula.",
            author: "60bae2f31a5372237c423856"
        })
        await campground.save();
    }
    
}

seedDB();