const User = require('../models/user');
const Post = require('../models/post');
const catchAsync = require('../utils/catchAsync');



module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
   
       
  try{
    // console.log('this is request body',req.body);
        const { email, username, password, description } = req.body;
        const user = new User({ email, username });
        user.image = req.files.map(img => ({url: img.path, filename: img.filename}));
       user.description = description;
        const registeredUser = await User.register(user, password);
       
       
        req.login(registeredUser, err =>{
            if(err) {
                console.log(err);
                return next(err);
            }
            else
            {
                req.flash('sucess', 'Welcome ');
            res.redirect('/posts');
            }
        });
               
  }
  catch(e)
  {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('login');
    
  }
   
}
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {

    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/posts';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) =>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/posts');
      });
}

module.exports.profile = async(req, res) => {

    const {id}= req.params;
    
    const current = await User.findById(req.user._id);

   
    const user = await User.findById(id);

    const posts = await Post.find({});
    res.render('users/Profile', {user, posts, current});
}

module.exports.myProfile = async(req, res) =>{ 

   
    const user = await User.findById(req.user._id);

    

    const  posts  = await Post.find({});
    res.render('users/myProfile', {user, posts});
}


module.exports.follow = async(req, res) =>{

   
    const posts = await Post.find({});

  
const {id} = req.params;
const current = await User.findById(req.user._id);
const user = await User.findById(id)

user.followers.push(req.user._id);
current.following.push(id);

await current.save();
await user.save();
res.redirect(`/profile/${id}`);

 
}

module.exports.unfollow = async(req, res) =>{
    const posts = await Post.find({});

  
    const {id} = req.params;
    const current = await User.findById(req.user._id);
    const user = await User.findById(id)
    
    user.followers.pull(req.user._id);
    current.following.pull(id);
   
    await current.save();
    await user.save();
    res.redirect(`/profile/${id}`);
 
}


module.exports.chat = async(req, res) =>{
    const { cid, uid} = req.params;
    const current = await User.findById(cid);
    const user = await User.findById(uid);
 
    res.render('users/chat', {current, user});
    
}