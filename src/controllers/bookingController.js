const bookingService = require("../services/bookingService");

const validateBooking = (body) => {
  const { date, scheduleId } = body;

  if (date === undefined || scheduleId === undefined) {
    return {
      error: "date y scheduleId son obligatorios"
    };
  }

  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return {
      error: "La fecha debe tener formato YYYY-MM-DD"
    };
  }

  const bookingDate = new Date(`${date}T00:00:00.000Z`);

  if (
    Number.isNaN(bookingDate.getTime()) ||
    bookingDate.toISOString().slice(0, 10) !== date
  ) {
    return {
      error: "Fecha invalida"
    };
  }

  const id = Number(scheduleId);

  if (!Number.isInteger(id) || id <= 0) {
    return {
      error: "scheduleId debe ser un entero positivo"
    };
  }

  return {
    date: bookingDate,
    scheduleId: id
  };
};

const createBooking = async (req, res, next) => {
  try {
    const data = validateBooking(req.body);

    if (data.error) {
      return res.status(400).json({
        message: data.error
      });
    }

    const schedule = await bookingService.findScheduleById(
      data.scheduleId
    );

    if (!schedule) {
      return res.status(404).json({
        message: "Horario no encontrado"
      });
    }

    const occupied = await bookingService.findOccupiedSchedule(
      data.date,
      data.scheduleId
    );

    if (occupied) {
      return res.status(400).json({
        message: "El horario ya está ocupado"
      });
    }

    const booking = await bookingService.createBooking({
      date: data.date,
      scheduleId: data.scheduleId,
      userId: req.user.id
    });

    return res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

const getBooking = async (req, res, next) => {
  try {
    return res.status(200).json(req.booking);
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const data = validateBooking(req.body);

    if (data.error) {
      return res.status(400).json({
        message: data.error
      });
    }

    const schedule = await bookingService.findScheduleById(
      data.scheduleId
    );

    if (!schedule) {
      return res.status(404).json({
        message: "Horario no encontrado"
      });
    }

    const occupied = await bookingService.findOccupiedSchedule(
      data.date,
      data.scheduleId,
      req.booking.id
    );

    if (occupied) {
      return res.status(400).json({
        message: "El horario ya está ocupado"
      });
    }

    const booking = await bookingService.updateBooking(
      req.booking.id,
      data
    );

    return res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    await bookingService.deleteBooking(req.booking.id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking
};