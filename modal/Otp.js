const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

// Automatically set expiration time to 30 seconds from creation
otpSchema.pre("save", function (next) {
    this.expiresAt = new Date(this.createdAt.getTime() + 30 * 1000);
    next();
});

module.exports = mongoose.model("Otp", otpSchema);
