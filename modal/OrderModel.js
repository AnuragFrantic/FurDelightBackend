const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
    order_id: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    item: [
        {
            type: mongoose.Schema.Types.Mixed
        }
    ],
    total_price: {
        type: Number,
        required: true,
    },
    payment_status: {
        type: String,
        enum: ["pending", "successful", "failed"],
        default: "pending",
    },
    order_status: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled", "returned"],
        default: "processing",
    },
    payment_method: {
        type: String,
        enum: ["cod", "credit_card", "debit_card", "paypal", "upi"],
        required: true,
    },

    deleted_at: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
