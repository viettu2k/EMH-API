const Notification = require("../models/notification");
const { errorHandler } = require("../helpers/dbErrorHandler");
const _ = require("lodash");

exports.notificationById = (req, res, next, id) => {
    Notification.findById(id).exec((err, notification) => {
        if (err || !notification) {
            return res.status(400).json({
                error: "notification not found",
            });
        }
        req.notification = notification;
        next();
    });
};

exports.read = (req, res) => {
    return res.json(req.notification);
};

exports.create = (req, res) => {
    const notification = new notification(req.body);
    const { title, content } = notification;
    if (!title || !content) {
        return res.status(400).json({
            error: "All fields  are required",
        });
    }
    notification.createdBy = req.profile;
    Notification.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

exports.update = (req, res) => {
    let notification = req.notification;
    notification = _.extend(notification, req.body);
    Notification.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const notification = req.notification;
    Notification.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ message: "Notification deleted successfully" });
    });
};

exports.list = (req, res) => {
    notification
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
    notification
        .find({ createdBy: req.profile._id })
        .populate("createdBy", "_id name")
        .sort("-createdAt")
        .exec((err, notifications) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            res.json(notifications);
        });
};