const { Schema, default: mongoose } = require("mongoose");
const schema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            trim: true
        },
        name: {
            type: String
        },
        about: {
            type: String
        },
        work_experience: {
            type: Number,
        },
        graduation_certificate: {
            type: String,
        },

        post_graduation_certificate: {
            type: String,
        },
        mci_certificate: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["Male", "Female"]
        },
        email: {
            type: String,
        },
        dob: {
            type: String,
        },


        password: {
            type: String,
        },
        phone: {
            type: String,
            required: true
        },

        user_type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserType",
            required: true,
        },
        verification: {
            type: Boolean,
            default: true,
        },
        roles: [
            {
                type: { type: mongoose.Schema.Types.ObjectId, ref: 'Modules', required: false, default: null },
                value: [{ type: String, required: false }]
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", schema);
