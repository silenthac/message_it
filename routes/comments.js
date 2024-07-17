const Post = require('../models/post');
const Comment = require('../controllers/comments');
const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router({mergeParams: true});
const {isLoggedIn, isCommentAuthor, isAuthor} = require('../middleware');

router.post('/',isLoggedIn, catchAsync(Comment.addComment));

router.delete('/:commentId',isLoggedIn,isAuthor,isCommentAuthor,catchAsync(Comment.deleteComment));

module.exports = router;
