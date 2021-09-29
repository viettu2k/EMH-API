const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById, list, update } = require("../controllers/user");

router.get("/users/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile,
    });
});
router.put("/users/:userId", requireSignin, isAuth, update);
router.get("/users", list);

router.param("userId", userById);

module.exports = router;