const express = require("express");
const router = express.Router();

const {
    create,
    notificationById,
    read,
    remove,
    update,
    list,
    createByUser,
} = require("../controllers/notification");
const {
    requireSignin,
    isAuth,
    isMedicalStaff,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/notifications/:notificationId", read);
router.post(
    "/notifications/:userId",
    requireSignin,
    isAuth,
    isMedicalStaff,
    create
);
router.put(
    "/notifications/:notificationId/:userId",
    requireSignin,
    isAuth,
    isMedicalStaff,
    update
);
router.delete(
    "/notifications/:notificationId/:userId",
    requireSignin,
    isAuth,
    isMedicalStaff,
    remove
);
router.get("/notifications", list);
router.get(
    "/notifications/by/:userId",
    requireSignin,
    isMedicalStaff,
    createByUser
);

router.param("userId", userById);
router.param("notificationId", notificationById);

module.exports = router;