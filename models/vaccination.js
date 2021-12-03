const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const vaccinationSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 100,
    },
    vaccine: {
        name: String,
        timeConsuming: Number,
        id: { type: ObjectId, ref: "Vaccine" },
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
    vaccineDate: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: ObjectId,
        ref: "User",
    },
    participants: [{
        name: String,
        vaccinationTime: Date,
        vaccineName: String,
        status: { type: Boolean, default: false },
        id: { type: ObjectId, ref: "User" },
    }, ],
    ownership: { type: ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Vaccination", vaccinationSchema);