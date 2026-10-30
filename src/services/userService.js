const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

const getUserBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: {
      userId: Number(userId)
    },
    include: {
      schedule: true
    },
    orderBy: {
      date: "asc"
    }
  });
};

module.exports = {
  getUserBookings
};