const express = require("express");
const router = express.Router();
const csvController = require("../controllers/csvController");

module.exports = (upload) => {
  router.post("/", upload.single("file"), csvController.processCSVUpload);
  return router;
};
