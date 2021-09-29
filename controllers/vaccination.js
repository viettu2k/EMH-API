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

/* default query */
/* api/vaccinations?sortBy=createdAt&order=desc&limit=5 */

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "desc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
    let limit = req.query.limit ? parseInt(req.query.limit) : 5;

    Vaccination.find()
        .populate("owner")
        .sort([
            [sortBy, order]
        ])
        .limit(limit)
        .exec((err, vaccinations) => {
            if (err) {
                return res.status(400).json({
                    error: "Vaccinations not found",
                });
            }
            res.send(vaccinations);
        });
};