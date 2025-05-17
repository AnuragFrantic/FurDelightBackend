const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    net_payable_amount: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    promo_discount: { type: Number, required: false },
    shipping_address: {
        type: Schema.Types.ObjectId, ref: 'ShippingAddress', required: false
    },
    payment_status: {
        type: String,
        default: "Pending",
        trim: true,
        enum: ['Pending', 'Failed', 'Completed']
    },
    payment_type: {
        type: String,
        default: "COD",
        trim: true,
        enum: ['COD', 'Online']
    },
    order_status: {
        type: String,
        enum: [
            'Created',        // Order created
            'PendingPayment', // Waiting for online payment
            'Confirmed',      // Payment done / COD confirmed
            'Shipped',
            'Delivered',
            'Cancelled',
            'Returned'
        ],
        default: 'Created'
    },

    payment_request: { type: Schema.Types.Mixed, required: false },
    payment_response: { type: Schema.Types.Mixed, required: false },
    cart_response: { type: Schema.Types.Mixed, required: false },

    order_placed: {
        type: Boolean,
        default: false
    },
    shipping_charge: {
        type: Number
    },


    deleted_at: { type: Date, default: null },

}, { timestamps: true });

const Orders = mongoose.model("Orders", schema);
module.exports = Orders;
