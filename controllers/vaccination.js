const Vaccination = require("../models/vaccination");
const { errorHandler } = require("../helpers/dbErrorHandler");
const _ = require("lodash");

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

/* default query */
/* api/vaccinations?sortBy=createdAt&order=desc&limit=5 */

// exports.list = (req, res) => {
//     let order = req.query.order ? req.query.order : "desc";
//     let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
//     let limit = req.query.limit ? parseInt(req.query.limit) : 5;

//     Vaccination.find()
//         .populate("owner")
//         .sort([
//             [sortBy, order]
//         ])
//         .limit(limit)
//         .exec((err, vaccinations) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: "Vaccinations not found",
//                 });
//             }
//             res.send(vaccinations);
//         });
// };

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
    Vaccination.findByIdAndUpdate(
        req.body.vaccinationId, { $push: { participants: req.body.name } }, { new: true }
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
    Vaccination.findByIdAndUpdate(
        req.body.vaccinationId, { $pull: { participants: req.body.name } }, { new: true }
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