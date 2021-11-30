const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const vaccineSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 200,
    },
    type: {
        type: String,
        maxlength: 2000,
        trim: true,
    },
    quantity: {
        type: Number,
    },
    timeConsuming: {
        type: Number,
    },
    consumed: {
        type: Number,
        default: 0,
    },
    createdBy: { type: ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Vaccine", vaccineSchema);