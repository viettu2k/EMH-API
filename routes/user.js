const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const { userById, read, update } = require("../controllers/user");

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile,
    });
});

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);
// create medical center
router.post("/center", requireSignin, isAuth, isAdmin, createCenter);
// get photo from DB
router.get("/user/photo/:userId", userPhoto);
router.param("userId", userById);

module.exports = router;