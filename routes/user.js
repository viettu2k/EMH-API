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
    createFamilyMember,
    addMember,
    getCenters,
    userPhoto,
    addToHistory,
    removeFromHistory,
    getListUser,
    deleteUser,
    updateHistory,
} = require("../controllers/user");

router.put("/user/add-to-history", requireSignin, addToHistory);
router.put("/user/remove-from-history", requireSignin, removeFromHistory);

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile,
    });
});

router.get("/user/:userId", read);
router.put("/user/:userId", requireSignin, update);
router.put("/user/history/:userId", requireSignin, updateHistory);
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
// add family member
router.post(
    "/family-member/:userId",
    requireSignin,
    isAuth,
    createFamilyMember
);
// add member
router.put("/add-member/:userId", requireSignin, isAuth, addMember);

// add medical staff to members
router.get("/centers", getCenters);
// get photo from DB
router.get("/user/photo/:userId", userPhoto);
router.delete("/user/:userId", requireSignin, deleteUser);
router.get("/users", getListUser);

router.param("userId", userById);

module.exports = router;