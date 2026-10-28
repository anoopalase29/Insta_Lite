import "dotenv/config";
import app from "./server.js";
import prisma from "./db.js";

const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
