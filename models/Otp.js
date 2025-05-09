const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({

    phone: {
        type: String,

    },
    otp: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,

    },

});

// Automatically set expiration time to 30 seconds from creation
otpSchema.pre("save", function (next) {
    this.expiresAt = new Date(this.createdAt.getTime() + 30 * 1000);
    next();
});

module.exports = mongoose.model("Otp", otpSchema);
