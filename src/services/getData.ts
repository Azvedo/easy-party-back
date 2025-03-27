import db from "../config/database";
import { getOpenAIResponse } from "../utils/openAI";

async function getDbData({ prompt }: { prompt: string }) {
  try {
    const response = await getOpenAIResponse(prompt);
    const query = response.trim(); // Remove espaços extras no início e no fim da string

    // Executa a consulta SQL
    const data = await db.unsafe(query);

    // Verifica se há dados com id repetido
    const uniqueData = data.filter((item: any, index: number, self: any[]) =>
      index === self.findIndex((t) => t.service_id === item.service_id)
    );

    return uniqueData;
  } catch (error) {
    console.error("Error getting data from database:", error);
    throw new Error("Failed to get data from database");
  }
}

export default getDbData;