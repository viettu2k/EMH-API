const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Center = require("../models/center");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.centerById = (req, res, next, id) => {
    Center.findById(id).exec((err, center) => {
        if (err || !center) {
            return res.status(400).json({
                error: "Center not found",
            });
        }
        req.center = center;
        next();
    });
};

exports.read = (req, res) => {
    req.center.photo = undefined;
    return res.json(req.center);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }

        // check for all fields
        const { name, description, address, hotline } = fields;
        if (!name || !description || !address || !hotline) {
            return res.status(400).json({
                error: "All fields  are required",
            });
        }

        let center = new Center(fields);

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size",
                });
            }
            center.photo.data = fs.readFileSync(files.photo.path);
            center.photo.contentType = files.photo.type;
        }

        center.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json(result);
        });
    });
};

exports.remove = (req, res) => {
    let center = req.center;
    center.remove((err, deletedCenter) => {
        if (err) {
            return res.status(400).json({ error: errorHandler(err) });
        }
        res.json({
            message: "Center deleted successfully",
        });
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }

        // check for all fields
        const { name, description, address, hotLine } = fields;
        if (!name || !description || !address || !hotLine) {
            return res.status(400).json({
                error: "All fields  are required",
            });
        }

        let center = req.center;
        center = _.extend(center, fields);

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size",
                });
            }
            center.photo.data = fs.readFileSync(files.photo.path);
            center.photo.contentType = files.photo.type;
        }

        center.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json(result);
        });
    });
};

exports.list = (req, res) => {
    Center.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

exports.photo = (req, res, next) => {
    if (req.center.photo.data) {
        res.set("Content-Type", req.center.photo.contentType);
        return res.send(req.center.photo.data);
    }
    next();
};