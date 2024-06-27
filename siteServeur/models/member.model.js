const mongoose = require("mongoose");

const memberScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    lastName: String,
    firstName: String,
    age: Number,
    isStudent: Boolean,
    isTeacher: Boolean
})