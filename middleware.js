const ExpressError = require('./utils/ExpressError');
const Post = require('./models/post');
const Comment = require('./models/comments');
const User = require('./models/user');

module.exports.isLoggedIn = (req, res, next) => {
    // console.log('Req.USER...', req.user);
    
    if (!req.isAuthenticated()) {
        
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) =>{
    const {id, commentId} = req.params;
    const comment = await Comment.findById(commentId);
    
    if(!comment.author.equals(req.user._id))
    {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/posts/${id}`);
    }
      next();
}


module.exports.isAuthor = async (req, res, next) =>{
    const {id} = req.params;
    const post = await Post.findById(id);
    
    if(!post.author.equals(req.user._id))
    {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/posts/${id}`);
    }
      next();
}
