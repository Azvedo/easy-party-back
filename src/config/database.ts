import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const conncectionString = process.env.DATABASE_URL;

if (!conncectionString) {
  throw new Error("DATABASE_URL is not defined");
}

console.log("connection string:",conncectionString)

const db = postgres(conncectionString);

export default db;
