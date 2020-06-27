const express = require("express");
const router = express.Router();
const twitter = require("./twiter");

router.use("/twitter", twitter);

module.exports = router;
