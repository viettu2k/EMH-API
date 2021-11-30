const Vaccination = require("../models/vaccination");
const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const _ = require("lodash");
const { sendEmail } = require("../helpers/sendEmail");

exports.vaccinationById = (req, res, next, id) => {
    Vaccination.findById(id).exec((err, vaccination) => {
        if (err || !vaccination) {
            return res.status(400).json({
                error: "Vaccination not found",
            });
        }
        req.vaccination = vaccination;
        next();
    });
};

exports.read = (req, res) => {
    return res.json(req.vaccination);
};

exports.create = (req, res) => {
    const vaccination = new Vaccination(req.body);
    const { name, notes, vaccine, address, limit, vaccineDate } = vaccination;
    if (!name || !notes || !vaccine || !address || !limit || !vaccineDate) {
        return res.status(400).json({
            error: "All fields  are required",
        });
    }
    if (limit < 0) {
        return res.status(400).json({
            error: "Limit cannot be negative",
        });
    }
    vaccination.createdBy = req.profile;
    vaccination.ownership = req.profile.references;
    vaccination.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

exports.update = (req, res) => {
    let vaccination = req.vaccination;
    vaccination = _.extend(vaccination, req.body);
    vaccination.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const vaccination = req.vaccination;
    vaccination.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ message: "Vaccination deleted successfully" });
    });
};

exports.list = (req, res) => {
    Vaccination.find()
        .sort("-createdAt")
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.json(data);
        });
};

exports.createByUser = (req, res) => {
    Vaccination.find({ createdBy: req.profile._id })
        .populate("createdBy", "_id name")
        .sort("-createdAt")
        .exec((err, vaccinations) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            res.json(vaccinations);
        });
};

exports.listByCenter = (req, res) => {
    Vaccination.find({ ownership: req.center._id })
        .populate("ownership", "_id name")
        .sort("-createdAt")
        .exec((err, vaccinations) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            res.json(vaccinations);
        });
};

exports.registerVaccination = (req, res) => {
    const { vaccinationId, name, id } = req.body;
    Vaccination.findByIdAndUpdate(
        vaccinationId, { $push: { participants: { name, id } } }, { new: true }
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

exports.cancelRegister = (req, res) => {
    const { vaccinationId, name, id } = req.body;
    Vaccination.findByIdAndUpdate(
        vaccinationId, { $pull: { participants: { name, id } } }, { new: true }
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

exports.sendVaccinationTime = (req, res) => {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email) {
        return res.status(400).json({ message: "No Email in request body" });
    }
    // console.log("forgot password finding user with that email");
    const { email, vaccinationName, vaccinationTime } = req.body;
    // find the user based on email
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "User with that email does not exist!",
            });

        // email data
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: vaccinationName,
            text: `You have successfully registered for vaccination! Your vaccine time is: ${vaccinationTime}`,
            html: `<p>You have successfully registered for vaccination! Your vaccine time is: </p> <p>${vaccinationTime}</p>`,
        };

        sendEmail(emailData);
        return res.status(200).json({
            message: `You can check your vaccine time in your email.`,
        });
    });
};