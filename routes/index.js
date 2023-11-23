const express = require('express');
const router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const infoModel = require('./profile');
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
  const info = new infoModel({
    user: user._id
  })
  user.info.push(info._id);
  info.save()
  .then(()=>{
    userModel.register(user, req.body.password)
    .then(function (u) {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/feed');
      })
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
  const userInfo = await infoModel.findOne({_id: user.info})
  res.render('profile',{user, userInfo})
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
