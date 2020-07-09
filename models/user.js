const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    uid: { type: String, unique: true, required: true },
    userName: { type: String, required: true },
    imageUrl: { type: String, default: null },
    likes: { type: Number, default: 0 },
    best: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("User", userSchema)
