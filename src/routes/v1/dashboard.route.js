const express = require("express");
const dashboardController = require("../../modules/dashboard/controller/dashboard.controller");

const router = express.Router();

router.get("/all-collection-count", dashboardController.getTotalCountForDashboard);


module.exports = router;
