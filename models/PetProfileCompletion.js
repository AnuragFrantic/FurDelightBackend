const { Schema, default: mongoose } = require('mongoose');

const schema = new Schema({
    question: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['options', 'grid']
    },
    options: [
        {
            name: {
                type: String
            }
        }
    ],
    answerModel: {
        type: String,
        enum: ['PetProfileForm', 'PetFood', 'PetActivity'] // add more as needed
    },
    position: {
        type: Number,
        required: true,
    },
    api: {
        type: String,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model("PetProfileForm", schema);
