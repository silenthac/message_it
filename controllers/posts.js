const express = require('express');
const app = express();
const Post = require('../models/post');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary');

module.exports.index = async(req, res) =>{
     
    const posts = await Post.find({});
    const users = await User.find({});
    res.render('post/index', {posts,users})
}

module.exports.renderNewPost = async(req, res) => {

    res.render('post/new');
}

module.exports.createNewPost = async(req, res) =>{ 

   
      const  posts  = new Post(req.body.post);
      posts.media = req.files.map(f => ({url: f.path, filename: f.filename}))

      posts.author = req.user._id;
     
      const user = await User.findById(posts.author._id);
      var temp = user.postc;
      
      var currentdate = new Date(); 
var fulltime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " at "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes();
      posts.timeStamp = fulltime;
      
      temp++;
      
      user.postc = temp;
      
     
      if(!posts)
      {
        req.flash('error', 'You need to login first');
      }
   
    await posts.save();
    // console.log(posts);
    user.save();
    req.flash('success', 'Successfully created a new post!')
    res.redirect(`/posts/${posts._id}`);
}

module.exports.editPost = async(req, res) =>{
    const {id} = req.params;
    const post = await Post.findById(id);
    res.render('post/edit', { post });
}
module.exports.updatePost = async(req, res) =>{
   

    const {id} = req.params;
    
    const post = await Post.findByIdAndUpdate(id, {...req.body.post});
    
    var currentdate = new Date(); 
var fulltime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " at "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes();
      post.timeStamp = fulltime;
    if(req.files)
    {
    const img = req.files.map(f => ({url: f.path, filename: f.filename}))
    post.media.push(...img);
    await post.save();
     }
    
     
  
    if(req.body.deleteImages)
    {
        console.log(req.body.deleteImages);
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename);
            
        }
        await post.updateOne({$pull: {media: {filename: {$in: req.body.deleteImages}}}});

    }
  
    console.log(post);
   
    req.flash('success', 'Successfully updated post!');
    res.redirect(`/posts/${post._id}`);
}

module.exports.showPost = async(req, res) =>{
    
    const post = await Post.findById(req.params.id).populate(
        {
            path:'comments',
            populate: {
                path: 'author'
            }

        }
        
    ).populate('author');

const user = await User.findById(post.author._id);

    if(!post)
    {
        req.flash('error','Cannot find the post');
        return res.redirect('/posts');
    }
    res.render('post/show', {post, user});
}


module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    const  posts  = await Post.findById(id);
    const user = await User.findById(posts.author._id);
    var temp = user.postc;
    
    // console.log(temp)
    temp--;
    // console.log('after decrementing', temp);
    user.postc = temp;
    user.save();
    
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post');
    res.redirect('/posts');
};

module.exports.likePost = async(req, res) => {

    const { id } = req.params;
    const post = await Post.findById(id);
    const user = await User.findById(post.author._id);
    var like = post.likes;
    like++;

    post.likedPost.push(req.user._id);
    post.likes = like;
    post.save();
    
    res.redirect(`/posts/${id}`);
}

module.exports.unlikePost = async(req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user = await User.findById(post.author._id);
    var like = post.likes;
    like--;
    post.likedPost.pull(req.user._id);
    post.likes = like;
    post.save();
    res.redirect(`/posts/${id}`);
}