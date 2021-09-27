const express = require("express");
const router = express.Router();

const { create } = require("../controllers/vaccination");
const {
    requireSignin,
    isAuth,
    isAdmin,
    isMedicalStaff,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.post(
    "/vaccinations/create/:userId",
    requireSignin,
    isAuth,
    isMedicalStaff,
    create
);

router.param("userId", userById);

module.exports = router;