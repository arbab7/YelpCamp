const User = require('../models/user');

module.exports.registerFrom = (req, res) => {
    res.render('users/register');
}

module.exports.registerNewUser = async(req, res) => {
    try{
    const {username, password, email} = req.body;
    const user = new User({username, email});
    const regUser = await User.register(user, password);
    req.login(regUser, err => {
        if(err) return next(err);
        req.flash('success', 'Welcome to YelpCamp');
    res.redirect('/campgrounds')
    })
    
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectedUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectedUrl)
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "See you again...")
    res.redirect('/campgrounds')
}