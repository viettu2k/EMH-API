const express = require("express");
const router = express.Router();

const {
    create,
    centerById,
    read,
    remove,
    update,
} = require("../controllers/center");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/centers/:centerId", read);
router.post("/centers/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
    "/centers/:centerId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.put(
    "/centers/:centerId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);

router.param("userId", userById);
router.param("centerId", centerById);

module.exports = router;