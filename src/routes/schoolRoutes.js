const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/schoolController");

// Define API endpoints
router.post("/addSchool", schoolController.addSchool);
router.get("/listSchools", schoolController.listSchools);
router.put("/updateSchool/:id", schoolController.updateSchool);


module.exports = router;

