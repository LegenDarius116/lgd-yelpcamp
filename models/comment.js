var mongoose = require('mongoose');

// schema setup
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        username: String
    }
});

// object variable that will interact with mongoDB
var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;