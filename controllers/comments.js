const Post = require('../models/post');
const Comment = require('../models/comments');

module.exports.addComment = async(req, res) =>{

    const post = await Post.findById(req.params.id);
    const  comment  = new Comment(req.body.comment);
    comment.author = req.user._id;
    // console.log(comment.author);
    post.comments.push(comment);
    await comment.save();
    await post.save();
    res.redirect(`/posts/${post._id}`);
}

module.exports.deleteComment = async(req, res) =>{
    // console.log('Going to delete');
     const {id, commentId} = req.params;
     await Post.findByIdAndUpdate(id, {$pull: {comments: commentId}});
     await Comment.findByIdAndDelete(commentId);
     req.flash('success', 'Successfully Deleted a Comment');
     res.redirect(`/posts/${id}`);
}