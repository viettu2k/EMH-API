const express = require("express");
const router = express.Router();

const { requireSignin, isAuth } = require("../controllers/auth");
const { userById, list, update, read } = require("../controllers/user");

router.get("/users/:userId", requireSignin, isAuth, read);
router.put("/users/:userId", requireSignin, isAuth, update);
router.get("/users", list);

router.param("userId", userById);

module.exports = router;