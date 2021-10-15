const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 100,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    about: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    participants: [{ type: ObjectId, ref: "User", default: [] }],
    createdBy: { type: ObjectId, ref: "User" },
    owner: { type: ObjectId, ref: "Center" },
}, { timestamps: true });

module.exports = mongoose.model("Test", testSchema);