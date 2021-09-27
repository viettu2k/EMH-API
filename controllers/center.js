const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Center = require("../models/center");
const { errorHandler } = require("../helpers/dbErrorHandler");

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
        const { name, description, address, hotLine } = fields;
        console.log(name, description, address, hotLine);
        if (!name || !description || !address || !hotLine) {
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
                return res.status(400).json({ error: errorHandler(err), save: true });
            }
            res.json(result);
        });
    });
};