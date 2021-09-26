const Vaccination = require("../models/vaccination");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    const vaccination = new Vaccination(req.body);
    vaccination.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ data });
    });
};