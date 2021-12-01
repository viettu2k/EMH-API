const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    hashed_password: {
        type: String,
    },
    salt: String,
    address: {
        type: String,
        trim: true,
        default: "",
    },
    description: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: "",
    },
    phoneNumber: {
        type: String,
        maxlength: 11,
        default: "",
    },
    dob: {
        type: Date,
    },
    role: {
        type: Number,
        default: 0,
    },
    histories: [{
        vaccinationName: String,
        status: { type: Boolean, default: false },
        vaccinationId: { type: ObjectId, ref: "User" },
        vaccinationTime: { type: Date },
    }, ],
    resetPasswordLink: {
        data: String,
        default: "",
    },
    references: {
        type: ObjectId,
        ref: "User",
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    members: [{ name: String, id: { type: ObjectId, ref: "User" } }],
}, { timestamps: true });

// virtual field
userSchema
    .virtual("password")
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    },
};

module.exports = mongoose.model("User", userSchema);