const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },

}, { timestamps: true });

// Ensure unique (user, product) pairs to prevent duplicate items
CartSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("Cart", CartSchema);
