const express = require("express");
const router = express.Router();

router.get("/chat-app", (req, res) => {
    res.send({ response: "Chat app is up and running." }).status(200);
});

module.exports = router;