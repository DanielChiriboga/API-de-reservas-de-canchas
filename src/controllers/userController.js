const userService = require("../services/userService");

const getUserBookings = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    const bookings = await userService.getUserBookings(userId);

    return res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserBookings
};