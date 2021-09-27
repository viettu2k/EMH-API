const express = require("express");
const router = express.Router();

const { create, centerById, read } = require("../controllers/center");
const {
    requireSignin,
    isAuth,
    isAdmin,
    isMedicalStaff,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/centers/:centerId", read);

router.post("/centers/create/:userId", requireSignin, isAuth, isAdmin, create);

router.param("userId", userById);
router.param("centerId", centerById);

module.exports = router;