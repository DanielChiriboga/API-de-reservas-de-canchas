const { Router } = require("express");

const authRouter = require("./auth");
const adminRouter = require("./admin");
const bookingRouter = require("./bookings");
const userRouter = require("./users");

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/bookings", bookingRouter);
router.use("/users", userRouter);

module.exports = router;