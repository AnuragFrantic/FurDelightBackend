const { Schema, default: mongoose } = require('mongoose');

const schema = new Schema({
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet"
    },
    bp: {
        type: String
    },
    weight: {
        type: Number,
    },
    pr: {
        type: Number,
    },
    temp: {
        type: Number,
    },
    bmi: {
        type: String
    },
    rbs: {
        type: String
    },
    sp02: {
        type: String
    },
    height: {
        type: String
    },

    chief_complaints: {
        type: String
    },
    history_present_illness: {
        type: String
    },
    past_history: {
        type: String
    },

    medical_history: {
        type: String
    },
    treatment_history: {  // Fixed spelling
        type: String
    },
    personal_history: {
        type: String
    },
    occupation_history: {
        type: String
    },
    sexual_history: {
        type: String
    },
    family_history: {
        type: String
    },
    current_living_situation: {
        type: String
    },
    physical_exam: {
        type: String
    },
    mental_status_exam: {
        type: String
    },
    diagnosis: {
        type: String
    },
    prescription: [
        {
            medicine_type: {
                type: String,
            },
            medicines: {
                type: String,
            },
            dosage: {
                type: String,
            },
            frequency: {
                type: String
            },
            timings: {
                type: String
            },
            duration: {
                type: String
            },
        }
    ],
    advice: {
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
}, { timestamps: true });

module.exports = mongoose.model("Prescription", schema);
