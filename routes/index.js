const express = require("express");
const {
  AuthController,
  DashboardController,
  PhotoController,
} = require("../controllers");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/login", AuthController.loginPage);
router.get("/register", AuthController.registerPage);
router.get("/confirm", AuthController.confirmEmail);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get(
  "/dashboard",
  authMiddleware,
  checkRole("student", "teacher", "admin"),
  DashboardController.dashboard
);
router.get("/photo", PhotoController.get);

module.exports = router;
