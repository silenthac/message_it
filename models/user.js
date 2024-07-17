const mongoose = require('mongoose');
const passportlocalmongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;
const profileSchema = new Schema({
    url: String,
    filename: String
})
profileSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload', '/upload/w_200');
})
 
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: [profileSchema],
description: {
    type: String
},
    postc: {
        type: Number,
        default: 0
    },
    followers: [{
       
        type: Schema.Types.ObjectId,
        ref: 'MsgUser'
    }],
    following: [{
      
        type: Schema.Types.ObjectId,
        ref: 'MsgUser'
    }]
   

});

userSchema.plugin(passportlocalmongoose);
module.exports = mongoose.model('MsgUser', userSchema);


