//import mongoose library
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

//create a userSchema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    id: {type: String, default: uuidv4()},
    createdAt: { type: Date, default: Date.now }
});

//register model to collection
const User = mongoose.model("sample_users", userSchema);

//make our model accessible to outside files
module.exports = User;
