const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "User not found" });
        }
        req.profile = user;
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        next();
    });
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.createCenter = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }

        // check for all fields
        const { name, email, password, description, address, phoneNumber } = fields;
        if (!name ||
            !email ||
            !password ||
            !description ||
            !address ||
            !phoneNumber
        ) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }

        if (password.length >= 1 && password.length <= 5) {
            return res.status(400).json({
                error: "Password must be at least 6 characters",
            });
        }

        if (/\d/.test(password)) {
            return res.status(400).json({
                error: "Password must contain a number",
            });
        }

        let user = new User(fields);

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size",
                });
            }
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        user.role = 3;

        user.save((err, result) => {
            console.log(err);
            if (err) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json(result);
        });
    });
};

exports.userPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set(("Content-Type", req.profile.photo.contentType));
        return res.send(req.profile.photo.data);
    }
    next();
};

exports.update = (req, res) => {
    // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
    const { name, password, dob, address, phoneNumber } = req.body;

    User.findOne({ _id: req.profile._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found",
            });
        }
        if (!name) {
            return res.status(400).json({
                error: "Name is required",
            });
        } else {
            user.name = name;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: "Password should be min 6 characters long",
                });
            } else {
                user.password = password;
            }
        }
        user.address = address;
        user.dob = dob;
        user.phoneNumber = phoneNumber;
        user.save((err, updatedUser) => {
            if (err) {
                console.log("USER UPDATE ERROR", err);
                return res.status(400).json({
                    error: "User update failed",
                });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });
};