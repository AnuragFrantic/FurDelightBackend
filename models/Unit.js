const mongoose = require("mongoose")


const Unitschema = new mongoose.Schema({

    title: {
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



module.exports = mongoose.model("Unit", Unitschema);


