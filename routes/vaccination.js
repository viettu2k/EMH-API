const express = require("express");
const router = express.Router();

const { create, vaccinationById } = require("../controllers/vaccination");
const {
    requireSignin,
    isAuth,
    isAdmin,
    isMedicalStaff,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/vaccinations/:vaccinationId", (req, res) => {
    res.json({
        vaccination: req.vaccination,
    });
});

router.post(
    "/vaccinations/create/:userId",
    requireSignin,
    isAuth,
    isMedicalStaff,
    create
);

router.param("userId", userById);
router.param("vaccinationId", vaccinationById);

module.exports = router;