const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware')
const users = require('../controllers/users')

router.route('/register')
    .get(users.registerFrom)
    .post(catchAsync(users.registerNewUser));

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser)

router.get('/logout', users.logout)

module.exports = router;