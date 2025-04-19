const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        default: "",
    },
    file: {
        type: String, // file path or URL
        default: null,
    },
    fileType: {
        type: String,
        enum: ["image", "pdf", "none"],
        default: "none"
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
