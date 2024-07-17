const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users')
const multer = require('multer');
const {isLoggedIn} = require('../middleware');

const { storage, storage2 } = require('../cloudinary');
const upload = multer({storage: storage2});

router.route('/me')
      .get(isLoggedIn, users.myProfile);

router.route('/profile/:id')
      .get(isLoggedIn,users.profile)
      .post()

router.route('/register')
      .get(users.renderRegister)
      .post(upload.array('image'), users.register);

router.route('/login')
      .get(users.renderLogin)
      .post(passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login' }), users.login)
    
router.put('/posts/:id/follow',isLoggedIn, users.follow);
router.put('/posts/:id/unfollow', isLoggedIn, users.unfollow);

router.get('/logout', users.logout);

router.get('/:cid/chats/:uid', users.chat);



module.exports = router;