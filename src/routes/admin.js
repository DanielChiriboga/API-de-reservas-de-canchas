const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const {
  createSchedule,
  getAllBookings,
} = require("../controllers/adminController");

const router = Router();

router.post("/schedules", authenticateToken, createSchedule);
router.get("/bookings", authenticateToken, getAllBookings);

module.exports = router;