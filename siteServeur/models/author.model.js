const mongoose = require("mongoose");

const authorScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    lastName: String,
    firstName: String,
    age: Number
})

authorScheme.virtual("books", {
    ref: "Book",
    localField: "_id",
    foreignField: "author",
})

module.exports = mongoose.model("Author", authorScheme);