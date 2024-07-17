if(process.env.NODE_ENV !== "production")
{
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ejsMate = require('ejs-mate');
const User = require('./models/user');
const path = require('path');
const app = express();
const postroutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');
const ExpressError = require('./utils/ExpressError');
const MongoDBStore = require('connect-mongo');
const Post = require('./models/post');
const cors = require('cors');

//setting up the chat server to be used with socket.io
const port = process.env.PORT || 3000;

const chatServer = require('http').Server(app);
chatServer.listen(5000);

const chatSocket = require('./chat_socket').chatSocket(chatServer);






// const dbUrl = 'mongodb://localhost:27017/MsgIt' ;
const dbUrl = process.env.DB_URL

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
  console.log('Database connected');
}

const store =  MongoDBStore.create({
    mongoUrl: dbUrl,
    crypto:{
    secret: 'thisshouldbeabettersecret!'
    },
    touchAfter: 24*3600
});
store.on('error', function(e){
    console.log('Session store error', e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // how do we store the user in the session
passport.deserializeUser(User.deserializeUser()) // how to get user out of the data
app.use(cors());


app.use(flash());
app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
  })




  
  
  app.use('/', userRoutes);
  app.post('/search', async(req, res)=>{
    let payload = req.body.payload.trim();
    // console.log(payload);
    let search = await User.find({username: {$regex: new RegExp('^'+ payload+ '.*', 'i')}}).exec();

    //Limit our search results to 10

    search = search.slice(0,10);
    res.send({payload: search});
  })

app.post('/searchPosts', async(req, res)=>{
    let payload = req.body.payload.trim();
    let search = await Post.find({title: {$regex: new RegExp('^'+ payload+ '.*', 'i')}}).exec();
    search = search.slice(0,10);
    res.send({payload: search});
})

  app.use('/posts', postroutes);
  app.use('/posts/:id/comments', commentRoutes);

  app.get('/', (req, res) => {
    res.render('home');
  })
  

  app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404));
  })
  
  
  app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
  })
  
  app.listen(port, ()=>{
      console.log(`Serving on port ${port}`);
  })