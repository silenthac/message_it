const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'MsgUser'
    }
});

module.exports = mongoose.model('Comments', commentSchema);