const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const createSchedule = async (data) => {
  const schedule = await prisma.schedule.create({
    data: {
      court: data.court,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });

  return schedule;
};

const getAllBookings = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      schedule: true,
    },
  });

  return bookings;
};

module.exports = {
  createSchedule,
  getAllBookings,
};