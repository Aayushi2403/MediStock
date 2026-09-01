const express = require("express");
const router = express.Router();
const { restockMedicine, getRestocks } = require("../controllers/restockController");

router.post("/", restockMedicine);
router.get("/", getRestocks);

module.exports = router;
