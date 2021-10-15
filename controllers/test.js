const Test = require("../models/test");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.testById = (req, res, next, id) => {
    Test.findById(id).exec((err, test) => {
        if (err || !test) {
            return res.status(400).json({
                error: "Test not found",
            });
        }
        req.test = test;
        next();
    });
};

exports.read = (req, res) => {
    return res.json(req.test);
};

exports.create = (req, res) => {
    const test = new Test(req.body);
    const { name, about, type, address } = test;
    if (!name || !about || !type || !address) {
        return res.status(400).json({
            error: "All fields  are required",
        });
    }
    test.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ data });
    });
};

exports.update = (req, res) => {
    const test = req.test;
    const { name, about, type, address } = req.body;
    if (!name || !about || !type || !address) {
        return res.status(400).json({
            error: "All fields  are required",
        });
    }
    test.name = name;
    test.about = about;
    test.type = type;
    test.address = address;
    test.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const test = req.test;
    test.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ message: "Test deleted successfully" });
    });
};

/* default query */
/* api/vaccinations?sortBy=createdAt&order=desc&limit=5 */

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "desc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
    let limit = req.query.limit ? parseInt(req.query.limit) : 5;

    Test.find()
        .populate("owner")
        .sort([
            [sortBy, order]
        ])
        .limit(limit)
        .exec((err, testes) => {
            if (err) {
                return res.status(400).json({
                    error: "Vaccinations not found",
                });
            }
            res.send(testes);
        });
};