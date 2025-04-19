const { Schema, default: mongoose } = require('mongoose')

const schema = new Schema({
    name: { type: String },
    image: { type: String },
    pet_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pettype'
    },
    pet_food_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PetFoodType'
    },
    description: { type: String },
    bg_color: { type: String },
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



module.exports = mongoose.model("PetFood", schema);