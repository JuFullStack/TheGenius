//const express = require("express");
//const router = express.Router();
const { Router } = require("express");
const router = Router();

router.use("/item", require("./item"));
router.use("/game", require("./game"));
router.use("/user", require("./user"));
//router.use("/movie", require("./movie/movie"));

module.exports = router;
