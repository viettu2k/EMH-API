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
    listByCenter,
    registerVaccination,
    cancelRegister,
    sendVaccinationTime,
    listParticipantsByCenter,
} = require("../controllers/vaccination");
const {
    requireSignin,
    isAuth,
    isMedicalStaff,
} = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { centerById } = require("../controllers/center");

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
router.put("/vaccinations/register", requireSignin, registerVaccination);
router.put("/vaccinations/cancel-register", requireSignin, cancelRegister);
router.get("/vaccinations/center/:userId", listByCenter);
router.get(
    "/vaccinations/center/participants/:userId",
    listParticipantsByCenter
);
router.post("/send-vaccination-time", sendVaccinationTime);
router.param("centerId", centerById);
router.param("userId", userById);
router.param("vaccinationId", vaccinationById);

module.exports = router;