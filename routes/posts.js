const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const posts = require('../controllers/posts');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');

const { storage } = require('../cloudinary');
const upload = multer({storage});

const {isLoggedIn, isAuthor} = require('../middleware');

router.route('/')
      .get(isLoggedIn,catchAsync(posts.index))
      .post(isLoggedIn,upload.array('media'),catchAsync(posts.createNewPost));

router.get('/new', isLoggedIn, catchAsync(posts.renderNewPost))



router.route('/:id')
      .get(isLoggedIn,catchAsync(posts.showPost))
      .put(isLoggedIn,isAuthor,upload.array('media'),catchAsync(posts.updatePost))
      .delete(isLoggedIn,isAuthor,catchAsync(posts.deletePost));

// router.post('/:id/follow', posts.follow);

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(posts.editPost))

router.post('/:id/like', isLoggedIn, catchAsync(posts.likePost));
router.post('/:id/unlike', isLoggedIn, catchAsync(posts.unlikePost));

module.exports = router;