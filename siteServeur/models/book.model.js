const mongoose = require("mongoose");

const bookScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true
    },
    nbOfPages: Number,
    description: String,
    image: String
})

module.exports = mongoose.model("Book", bookScheme);