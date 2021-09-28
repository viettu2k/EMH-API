const Vaccination = require("../models/vaccination");
const { errorHandler } = require("../helpers/dbErrorHandler");

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
    const { name, about, type, address } = vaccination;
    if (!name || !about || !type || !address) {
        return res.status(400).json({
            error: "All fields  are required",
        });
    }
    vaccination.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ data });
    });
};

exports.update = (req, res) => {
    const vaccination = req.vaccination;
    const { name, about, type, address } = req.body;
    if (!name || !about || !type || !address) {
        return res.status(400).json({
            error: "All fields  are required",
        });
    }
    vaccination.name = name;
    vaccination.about = about;
    vaccination.type = type;
    vaccination.address = address;
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
    Vaccination.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};