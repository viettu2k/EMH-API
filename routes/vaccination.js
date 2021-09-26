const express = require("express");
const router = express.Router();

const { create } = require("../controllers/vaccination");
const { userSignupValidator } = require("../validator");

router.post("/vaccination/create", create);

module.exports = router;