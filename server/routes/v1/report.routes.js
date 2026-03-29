const express = require("express");
const app = express.Router();

//importing report controller
const { getStockMovementReport, getInventorySummaryReport, getLowStockReport } = require("../../controllers/report.controller");
// importing middleware that verifies user token and roles
const authenticate = require("../../middlewares/auth.middleware"); // importing auth middleware
const authorizeRoles = require("../../middlewares/role.middleware"); // importing role middleware

//CRUD routers connecting its controllers
// protect all report routes
app.use(authenticate);


// Protected: loggedin user and admin can get operations
app.get("/stock-movements", authenticate, authorizeRoles("admin", "user"), getStockMovementReport);
app.get("/inventory-summary", authenticate, authorizeRoles("admin", "user"), getInventorySummaryReport);
app.get("/low-stock", authenticate, authorizeRoles("admin", "user"), getLowStockReport);

module.exports = app;