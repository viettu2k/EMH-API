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

router.get("/testes/:testId", read);
router.post("/testes/:userId", requireSignin, isAuth, isMedicalStaff, create);
router.put(
    "/testes/:testId/:userId",
    requireSignin,
    isAuth,
    isMedicalStaff,
    update
);
router.delete(
    "/testes/:testId/:userId",
    requireSignin,
    isAuth,
    isMedicalStaff,
    remove
);
router.get("/testes", list);

router.param("userId", userById);
router.param("testId", testById);

module.exports = router;