const mongoose = require('mongoose');
const Comment = require('./comments')
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
    url: String,
    filename: String
})
mediaSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_100');
 })
const postSchema = new Schema({
    title: {
        required: true,
        type: String,
    },
    description: String,
    timeStamp: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'MsgUser'
    },
    comments: [ 
        {
          type: Schema.Types.ObjectId,
          ref: 'Comments'
        }
    ],
    likes: {
        type: Number,
        default: 0
    },
    media: [mediaSchema],
    likedPost: [{
        type: Schema.Types.ObjectId,
        ref: 'MsgUser'
    }]

})
postSchema.post('findOneAndDelete', async function(doc) {
    console.log('Deleted');
  if(doc)
  {
      await Comment.deleteMany({
          _id: {
              $in: doc.comments
          }
      })
  }
  })

module.exports = mongoose.model('Post', postSchema);