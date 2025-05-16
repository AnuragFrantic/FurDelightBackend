const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // in this add product variant
    variant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },

}, { timestamps: true });



module.exports = mongoose.model("Cart", CartSchema);
