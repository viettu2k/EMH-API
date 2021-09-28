const express = require("express");
const router = express.Router();

const { create, vaccinationById, read } = require("../controllers/vaccination");
const {
    requireSignin,
    isAuth,
    isMedicalStaff,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/vaccinations/:vaccinationId", read);
router.post(
    "/vaccinations/:userId",
    requireSignin,
    isAuth,
    isMedicalStaff,
    create
);

router.param("userId", userById);
router.param("vaccinationId", vaccinationById);

module.exports = router;