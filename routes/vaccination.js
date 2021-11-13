const express = require("express");
const router = express.Router();

const {
    create,
    vaccinationById,
    read,
    remove,
    update,
    list,
    createByUser,
} = require("../controllers/vaccination");
const {
    requireSignin,
    isAuth,
    isMedicalStaff,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/vaccinations/:vaccinationId", read);
router.post(
    "/vaccinations/:userId",
    requireSignin,
    isAuth,
    isMedicalStaff,
    create
);
router.put(
    "/vaccinations/:vaccinationId/:userId",
    requireSignin,
    isAuth,
    isMedicalStaff,
    update
);
router.delete(
    "/vaccinations/:vaccinationId/:userId",
    requireSignin,
    isAuth,
    isMedicalStaff,
    remove
);
router.get("/vaccinations", list);
router.get(
    "/vaccinations/by/:userId",
    requireSignin,
    isMedicalStaff,
    createByUser
);
router.param("userId", userById);
router.param("vaccinationId", vaccinationById);

module.exports = router;