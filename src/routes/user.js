const { Router } = require("express");

const authenticateToken = require("../middlewares/auth");
const authorizeUser = require("../middlewares/authorizeUser");
const userController = require("../controllers/userController");

const router = Router();

router.get(
  "/:id/bookings",
  authenticateToken,
  authorizeUser,
  userController.getUserBookings
);

module.exports = router;