import  dotenv  from "dotenv";
import  OpenAI  from "openai";

dotenv.config();

const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});

export default client