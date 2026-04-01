import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("12345678", 10);

  await prisma.user.createMany({
    data: [
      // ADMIN
      {
        name: "Admin",
        email: "admin@test.com",
        password,
        role: "ADMIN",
      },

      // USERS
      {
        name: "User1",
        email: "user1@test.com",
        password,
        role: "USER",
      },
      {
        name: "User2",
        email: "user2@test.com",
        password,
        role: "USER",
      },

      // MENTORS
      {
        name: "Mentor1",
        email: "mentor1@test.com",
        password,
        role: "MENTOR",
      },
      {
        name: "Mentor2",
        email: "mentor2@test.com",
        password,
        role: "MENTOR",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Dummy users inserted");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());