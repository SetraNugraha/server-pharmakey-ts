import express, { Express, urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { prisma } from "./config/database";
import router from "./features/routing";
import { errorMiddleware } from "./middlewares/error.middleware";

const app: Express = express();
dotenv.config();
const PORT = process.env.PORT || 3001;

app.use(morgan(":method :url :status - :response-time ms"));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "../public/images")));
app.use("/api", router);
app.use(errorMiddleware);

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Connected to database successfuly");

    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect database: ", error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  console.log("\n Shutting down server ...");
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
