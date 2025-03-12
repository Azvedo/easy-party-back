import db from "../config/database";

async function getDbData() {
  try {
    const data = await db`SELECT * FROM services`;
    return data;
  } catch (error) {
    console.error("Error getting data from database:", error);
    throw new Error("Failed to get data from database");
  }
}

export default getDbData;