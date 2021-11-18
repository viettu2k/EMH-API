const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const vaccinationSchema = new mongoose.Schema({
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
        maxlength: 30,
    },
    notes: {
        type: String,
        trim: true,
        required: true,
        maxlength: 2000,
    },
    address: {
        type: String,
        trim: true,
    },
    limit: {
        type: Number,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: ObjectId,
        ref: "User",
    },
    participants: [{ type: ObjectId, ref: "User", default: [] }],
    ownership: { type: ObjectId, ref: "Center" },
}, { timestamps: true });

module.exports = mongoose.model("Vaccination", vaccinationSchema);