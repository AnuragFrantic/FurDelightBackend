const mongoose = require('mongoose')

const ShopByCategory = new mongoose.Schema({
    title: {
        type: String
    },

    image: {
        type: String
    },
    pet_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    bg_color: {
        type: String
    },
    deleted_at: { type: Date },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })



module.exports = mongoose.model("ShopByCategory", ShopByCategory);