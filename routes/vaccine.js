const express = require("express");
const router = express.Router();

const {
    create,
    vaccineById,
    read,
    remove,
    update,
    createByCenter,
} = require("../controllers/vaccine");
const {
    requireSignin,
    isAuth,
    isMedicalStaff,
    isMedicalCenter,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/vaccines/:vaccineId", read);
router.post(
    "/vaccines/:userId",
    requireSignin,
    isAuth,
    isMedicalCenter,
    create
);
router.put(
    "/vaccines/:vaccineId/:userId",
    requireSignin,
    isAuth,
    isMedicalCenter,
    update
);
router.delete(
    "/vaccines/:vaccineId/:userId",
    requireSignin,
    isAuth,
    isMedicalCenter,
    remove
);
router.get(
    "/vaccines/by/:userId",
    requireSignin,
    isMedicalCenter,
    createByCenter
);

router.param("userId", userById);
router.param("vaccineId", vaccineById);

module.exports = router;