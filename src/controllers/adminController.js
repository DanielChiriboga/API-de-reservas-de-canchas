const adminService = require("../services/adminService");

const createSchedule = async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Access denied. Admin only",
      });
    }

    const { court, startTime, endTime } = req.body;

    if (!court || !startTime || !endTime) {
      return res.status(400).json({
        error: "court, startTime y endTime son obligatorios",
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (
      typeof court !== "string" ||
      !court.trim() ||
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start >= end
    ) {
      return res.status(400).json({
        error: "Datos del horario no validos",
      });
    }

    const schedule = await adminService.createSchedule({
      court: court.trim(),
      startTime: start,
      endTime: end,
    });

    return res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Access denied. Admin only",
      });
    }

    const bookings = await adminService.getAllBookings();

    return res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSchedule,
  getAllBookings,
};
