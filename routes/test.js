const express = require("express");
const router = express.Router();

const {
    create,
    testById,
    read,
    remove,
    update,
    list,
} = require("../controllers/test");
const {
    requireSignin,
    isAuth,
    isMedicalStaff,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/tests/:testId", read);
router.post("/tests/:userId", requireSignin, isAuth, isMedicalStaff, create);
router.put(
    "/tests/:testId/:userId",
    requireSignin,
    isAuth,
    isMedicalStaff,
    update
);
router.delete(
    "/tests/:testId/:userId",
    requireSignin,
    isAuth,
    isMedicalStaff,
    remove
);
router.get("/tests", list);

router.param("userId", userById);
router.param("testId", testById);

module.exports = router;