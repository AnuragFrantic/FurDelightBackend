const mongoose = require("mongoose")

const ShippingAddressSchema = new mongoose.Schema({
    address: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    active: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


module.exports = mongoose.model("ShippingAddress", ShippingAddressSchema)