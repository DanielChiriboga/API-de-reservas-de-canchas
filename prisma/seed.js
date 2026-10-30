require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  const userName = process.env.SEED_USER_NAME;
  const userEmail = process.env.SEED_USER_EMAIL;
  if (!userName || !userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
    throw new Error("Configura SEED_USER_NAME y SEED_USER_EMAIL (correo institucional) en .env antes del seed");
  }

  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: { name: "Paulo Galarza", email: "paulo.galarza@example.com", password: await bcrypt.hash("admin123", 10), role: "ADMIN" },
  });
  const user = await prisma.user.create({
    data: { name: userName, email: userEmail, password: await bcrypt.hash(process.env.SEED_USER_PASSWORD || "user123", 10), role: "USER" },
  });
  const first = await prisma.schedule.create({
    data: { court: "Fútbol 1", startTime: new Date("2026-11-10T08:00:00.000Z"), endTime: new Date("2026-11-10T10:00:00.000Z") },
  });
  const second = await prisma.schedule.create({
    data: { court: "Vóley 1", startTime: new Date("2026-11-10T10:00:00.000Z"), endTime: new Date("2026-11-10T12:00:00.000Z") },
  });
  await prisma.booking.create({
    data: { date: new Date("2026-11-10T08:00:00.000Z"), user: { connect: { id: user.id } }, schedule: { connect: { id: first.id } } },
  });
  await prisma.booking.create({
    data: { date: new Date("2026-11-10T10:00:00.000Z"), user: { connect: { id: admin.id } }, schedule: { connect: { id: second.id } } },
  });
  console.log("Seed completo: 2 usuarios, 2 horarios y 2 reservas");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
