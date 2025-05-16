const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const schema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    net_payable_amount: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    promo_discount: { type: Number, required: false },
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

    payment_request: { type: Schema.Types.Mixed, required: false },
    payment_response: { type: Schema.Types.Mixed, required: false },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },

}, { timestamps: true });

const Orders = mongoose.model("Orders", schema);
module.exports = Orders;
