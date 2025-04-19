const mongoose = require("mongoose")

const ImageSchema = new mongoose.Schema({
    img: { type: String, required: true }
});

const PetEvents = new mongoose.Schema({
    image: [ImageSchema],
    url: {
        type: String
    },
    title: {
        type: String
    },
    date: {
        type: Date
    },
    location: {
        type: String
    },
    description: {
        type: String
    },
    short_description: {
        type: String
    },
    price: {
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



module.exports = mongoose.model("PetEvents", PetEvents);