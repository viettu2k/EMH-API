const formidable = require("formidable");
const _ = require("lodash");
const Center = require("../models/center");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return (
                res.status(400),
                json({
                    error: "Image could not be uploaded",
                })
            );
        }
        let center = new Center(fields);

        if (files.photo) {
            center.photo.data = fs.readFileSync(files.photo.path);
            center.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json(result);
        });
    });
};