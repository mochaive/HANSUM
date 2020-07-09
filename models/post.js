const mongoose = require("mongoose")

const timeSchema = new mongoose.Schema({
    startTime: {
        type: Number,
        default: 0,
        validate: [
            (val) => {
                return Number.isInteger(val) && val >= 0 && val <= 23
            },
            "0부터 23사이의 정수 값으로 입력해야 합니다.",
        ],
    },
    finishTime: {
        type: Number,
        default: 24,
        validate: [
            (val) => {
                return val && val >= 1 && val <= 24
            },
            "1부터 24사이의 정수 값으로 입력해야 합니다.",
        ],
    },
})

const postSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    time: { type: timeSchema, default: () => ({}) },
    color: { type: String, default: "#ffffff" },
    likes: { type: Array, default: null },
    public: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Post", postSchema)
