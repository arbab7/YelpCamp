const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {validateCampground, isLoggedIn, isAuthor} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const {storage} = require('../cloudinary');
var upload = multer({storage})

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.create));
    
router.get("/new", isLoggedIn, campgrounds.new)

router.route('/:id')
    .get(catchAsync(campgrounds.show))
    .patch(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.update))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.edit))

module.exports = router;