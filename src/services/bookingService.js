const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

const findBookingById = async (id) => {
  return await prisma.booking.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      schedule: true
    }
  });
};

const findScheduleById = async (id) => {
  return await prisma.schedule.findUnique({
    where: {
      id: Number(id)
    }
  });
};

const findOccupiedSchedule = async (date, scheduleId, excludeId = null) => {
  return await prisma.booking.findFirst({
    where: {
      date: date,
      scheduleId: Number(scheduleId),
      ...(excludeId !== null && {
        id: {
          not: Number(excludeId)
        }
      })
    }
  });
};

const createBooking = async (data) => {
  return await prisma.booking.create({
    data: {
      date: data.date,
      user: {
        connect: {
          id: Number(data.userId)
        }
      },
      schedule: {
        connect: {
          id: Number(data.scheduleId)
        }
      }
    },
    include: {
      schedule: true
    }
  });
};

const updateBooking = async (id, data) => {
  return await prisma.booking.update({
    where: {
      id: Number(id)
    },
    data: {
      date: data.date,
      schedule: {
        connect: {
          id: Number(data.scheduleId)
        }
      }
    },
    include: {
      schedule: true
    }
  });
};

const deleteBooking = async (id) => {
  return await prisma.booking.delete({
    where: {
      id: Number(id)
    }
  });
};

module.exports = {
  findBookingById,
  findScheduleById,
  findOccupiedSchedule,
  createBooking,
  updateBooking,
  deleteBooking
};