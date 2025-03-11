const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true
        },
        dob: {
            type: String,
        },
        work_experience: {
            type: Number
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["User", "Doctor", 'Admin'],
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", schema);
