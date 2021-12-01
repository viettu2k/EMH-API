const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.userById = (req, res, next, id) => {
    if (id === "add-to-history" || id === "remove-from-history") {
        next();
    } else {
        User.findById(id).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({ error: "User not found" });
            }
            req.profile = user;
            req.profile.hashed_password = undefined;
            req.profile.salt = undefined;
            next();
        });
    }
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    req.profile.photo = undefined;
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

        if (!/\d/.test(password)) {
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

        user.role = 2;

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            result.photo = undefined;
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

exports.createStaff = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }
        req.profile.photo = undefined;

        // check for all fields
        const { name, email, password, address, phoneNumber } = fields;
        if (!name || !email || !password || !address || !phoneNumber) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }

        if (password.length >= 1 && password.length <= 5) {
            return res.status(400).json({
                error: "Password must be at least 6 characters",
            });
        }

        if (!/\d/.test(password)) {
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

        user.role = 1;
        user.references = req.profile._id;

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            result.photo = undefined;
            res.json(result);
        });
    });
};

exports.addMember = (req, res) => {
    User.findByIdAndUpdate(req.profile._id, {
        $push: { members: req.body },
    }).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        } else {
            res.json(result);
        }
    });
};

exports.getCenters = (req, res) => {
    User.find({ role: 2 })
        .select("_id, name")
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.json(data);
        });
};

exports.update = (req, res, next) => {
    let form = new formidable.IncomingForm();
    // console.log("incoming form data: ", form);
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded",
            });
        }
        // save user
        let user = req.profile;
        // console.log("user in update: ", user);
        console.log(fields);
        user = _.extend(user, fields);

        // console.log("USER FORM DATA UPDATE: ", user);

        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            // console.log("user after update with form data: ", user);
            res.json(result);
        });
    });
};

exports.addToHistory = (req, res) => {
    const { _id, vaccinationName, vaccinationId, vaccinationTime } = req.body;
    User.findByIdAndUpdate(
        _id, {
            $push: {
                histories: { vaccinationName, vaccinationId, vaccinationTime },
            },
        }, { new: true }
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        } else {
            res.json(result);
        }
    });
};

exports.removeFromHistory = (req, res) => {
    const { _id, vaccinationName, vaccinationId, vaccinationTime } = req.body;
    User.findByIdAndUpdate(
        _id, {
            $pull: {
                histories: { vaccinationName, vaccinationId, vaccinationTime },
            },
        }, { new: true }
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        } else {
            res.json(result);
        }
    });
};