const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/age-distribution", userController.getAgeDistribution);

module.exports = router;
