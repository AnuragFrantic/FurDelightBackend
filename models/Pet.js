const { Schema, default: mongoose } = require('mongoose')

const schema = new Schema({
    name: {
        type: String
    },
    image: { type: String },
    breed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PetBreed'
    },
    gender: {
        type: String,
        enum: ['Female', 'Male'],
    },
    age: {
        type: Number
    },
    vaccination: {
        type: Boolean
    },
    profile_completion: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pet_eating: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PetFood'
        }
    ],
    meals_per_day: {
        type: Number
    },
    daily_walk_routine: {
        type: String
    },
    pet_form: [
        {
            question: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'PetProfileForm'
            },
            answerId: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    refPath: 'pet_form.answerModel'
                }
            ],
            answer: {
                type: String
            },
            answerModel: {
                type: String,
            }
        }
    ],
    activity: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PetActivity'
        }
    ],
    deleted_at: { type: Date },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})


module.exports = mongoose.model("Pet", schema);


