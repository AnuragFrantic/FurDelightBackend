const { Schema, default: mongoose } = require('mongoose')

const schema = new Schema({
    title: { type: String },
    detail: { type: String },
    type: { type: String },
    deleted_at: { type: Date },
    url: {
        type: String
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true })



module.exports = mongoose.model("Policy", schema);