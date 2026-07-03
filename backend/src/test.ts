import prisma from "./config/prisma.js";

async function main() {
  console.log(process.env.DATABASE_URL);
  const users = await prisma.user.findMany();

  console.log(users);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
