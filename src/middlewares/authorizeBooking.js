const bookingService = require("../services/bookingService");

const authorizeBooking = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(404).json({
        message: "Reserva no encontrada"
      });
    }

    const booking = await bookingService.findBookingById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Reserva no encontrada"
      });
    }

    if (
      Number(booking.userId) !== Number(req.user.id) &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({
        message: "No tienes permiso para acceder a esta reserva"
      });
    }

    req.booking = booking;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorizeBooking;