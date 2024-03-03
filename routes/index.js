const express = require("express");
const { MainController } = require("../controllers");

const router = express.Router();

router.get("/", MainController.index);

module.exports = router;
