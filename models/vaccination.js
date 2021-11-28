const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const vaccinationSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 100,
    },
    vaccine: { type: ObjectId, ref: "Vaccine" },
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
    vaccineDate: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: ObjectId,
        ref: "User",
    },
    participants: [{ name: String, id: { type: ObjectId, ref: "User" } }],
    ownership: { type: ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Vaccination", vaccinationSchema);