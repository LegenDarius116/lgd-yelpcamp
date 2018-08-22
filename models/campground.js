var mongoose = require('mongoose');

// schema setup
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    nightlyPrice: String, //allows us to preserve the formatting
    comments: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }], // should be an array of commend ID's, reference association 
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

// object variable that will interact with mongoDB
var Camp = mongoose.model("Camp", campSchema);

module.exports = Camp;