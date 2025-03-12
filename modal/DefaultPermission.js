const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const schema = new Schema({
    name: { type: String, required: true },
    user_type: { type: Schema.Types.ObjectId, ref: 'UserType', required: false }, //superadmin
    roles: [
        {
            type: { type: Schema.Types.ObjectId, ref: 'Modules', required: false, default: null },
            value: [{ type: String, required: false }]
        }
    ],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: false, default: null },

});

schema.index({ created_by: 1, name: 1, user_type: 1 }, { unique: true });

const DefaultPermissions = mongoose.model("DefaultPermissions", schema);
module.exports = DefaultPermissions;
