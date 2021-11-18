const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const testSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 100,
    },
    phoneNumber: {
        type: String,
        maxlength: 11,
        required: true,
        unique: true,
    },
    testTime: { type: Date },
    createdBy: { type: ObjectId, ref: "User" },
    place: { type: ObjectId, ref: "Center" },
}, { timestamps: true });

module.exports = mongoose.model("Test", testSchema);