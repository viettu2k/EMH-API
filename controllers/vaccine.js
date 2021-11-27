const Vaccine = require("../models/vaccine");
const { errorHandler } = require("../helpers/dbErrorHandler");
const _ = require("lodash");

exports.vaccineById = (req, res, next, id) => {
    Vaccine.findById(id).exec((err, vaccine) => {
        if (err || !vaccine) {
            return res.status(400).json({
                error: "Vaccine not found",
            });
        }
        req.vaccine = vaccine;
        next();
    });
};

exports.read = (req, res) => {
    return res.json(req.vaccine);
};

exports.create = (req, res) => {
    const vaccine = new vaccine(req.body);
    const { name, type, quantity, timeConsuming } = vaccine;
    if (!name || !type || !quantity || !timeConsuming) {
        return res.status(400).json({
            error: "All fields  are required",
        });
    }
    vaccine.createdBy = req.profile;
    Vaccine.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

exports.update = (req, res) => {
    let vaccine = req.vaccine;
    vaccine = _.extend(vaccine, req.body);
    Vaccine.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const vaccine = req.vaccine;
    Vaccine.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ message: "Vaccine deleted successfully" });
    });
};

exports.list = (req, res) => {
    vaccine
        .find()
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
    vaccine
        .find({ createdBy: req.profile._id })
        .populate("createdBy", "_id name")
        .sort("-createdAt")
        .exec((err, vaccines) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            res.json(vaccines);
        });
};