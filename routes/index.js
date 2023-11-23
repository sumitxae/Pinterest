const express = require('express');
const router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require('passport');
const upload = require('./multer');
const localStrategy = require('passport-local').Strategy;

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/login', (req, res, next) => {
  res.render("login", {err: req.flash("error")});
})

router.post('/register', (req, res, next) => {
  const user = new userModel({
    username: req.body.username,
    email: req.body.email,
    dp: req.body.dp,
  })
  userModel.register(user, req.body.password)
    .then(function (u) {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/feed');
      })
    })
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/feed',
  failureRedirect: '/login',
  failureFlash: true,
}), (req, res, next) => {
});

router.get('/feed', isLoggedIn, (req, res, next)=>{
  res.render('feed')
})

router.get('/profile', isLoggedIn, async (req, res, next)=>{
  const user = await userModel.findOne({username:req.session.passport.user})
  res.render('profile',{user})
})

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

router.post('/upload', upload.single('image') , (req, res, next) => {
  res.send("uploaded");
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');  
}

module.exports = router;
