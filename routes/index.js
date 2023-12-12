const express = require('express');
const router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const fs = require('fs');
const sharp = require('sharp');
const passport = require('passport');
const upload = require('./multer');
const { ifError } = require('assert');
const path = require('path');
const localStrategy = require('passport-local').Strategy;

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/login', (req, res, next) => {
  var err = req.flash("error");
  res.render("login",{err});
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

router.get('/feed', isLoggedIn, (req, res, next) => {
  res.render('feed')
})

router.get('/profile', isLoggedIn, async (req, res, next) => {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate('posts')
  res.render('profile', { user })
})

router.post('/ch-dp', isLoggedIn, upload.single('newdp'), async (req, res, next) => {

  const user = await userModel.findOne({ username: req.session.passport.user });

  //Delete Current Profile Picture
  await fs.unlink(`./public/images/uploads/${user.dp}`, (err) => { if (err) console.log(err); });

  //specify path for new resized image
  const filepath = path.join(__dirname, '..', 'public', 'images', 'uploads', `resized${req.file.filename}`)

  //resizing image using sharp
  await sharp(req.file.path)
    .resize(320, 240)
    .toFile(filepath)

  // updating user profile picture
  user.dp = `resized${req.file.filename}`;

  // deleting uploaded profile picture
  await fs.unlink(`./public/images/uploads/${req.file.filename}`, (err) => { if (err) console.log(err); });

  //saving the changes in user
  await user.save();
  res.redirect('/profile')
})

router.post('/createpost', isLoggedIn, upload.single('image'), async (req, res, next) => {
  const thisuser = await userModel.findOne({ username: req.session.passport.user });
  const filepath = path.join(__dirname, '..', 'public', 'images', 'uploads', `resized${req.file.filename}`)

  await sharp(req.file.path)
    .resize(550,500)
    .toFile(filepath)
  const newPost = postModel.create({
    postText: req.body.posttext,
    postImage: `resized${req.file.filename}`,
    user: thisuser._id
  });

  await fs.unlink(`./public/images/uploads/${req.file.filename}`, (err) => { if (err) console.log(err); });
  thisuser.posts.push((await newPost)._id);
  thisuser.save();
  res.redirect('/profile')
})

router.get('/edit', isLoggedIn, async (req, res, next) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('edit',{user})
})

router.post('/update', isLoggedIn, async (req, res, next) => {
  const user = await userModel.findOne({ username: req.session.passport.user});
  if (req.body.alias) user.nickname = req.body.alias
  user.about = req.body.bio
  await user.save();
  res.redirect('/profile')
})

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

module.exports = router;
