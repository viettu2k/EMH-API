const mongoose = require("mongoose");

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
    },
    about: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Vaccination", vaccinationSchema);