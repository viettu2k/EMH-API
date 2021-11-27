const express = require("express");
const router = express.Router();

const {
    requireSignin,
    isAuth,
    isAdmin,
    isMedicalCenter,
} = require("../controllers/auth");

const {
    userById,
    read,
    update,
    createCenter,
    createStaff,
    userPhoto,
} = require("../controllers/user");

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile,
    });
});

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);
// add medical center
router.post("/center/:userId", requireSignin, isAuth, isAdmin, createCenter);
// add medical staff
router.post(
    "/staff/:userId",
    requireSignin,
    isAuth,
    isMedicalCenter,
    createStaff
);
// get photo from DB
router.get("/user/photo/:userId", userPhoto);
router.param("userId", userById);

module.exports = router;