import client from "../config/openAI";

export const getOpenAIResponse = async (prompt: string): Promise<string> => {
  try {
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o-mini",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    return completion.choices[0].message.content || "No response from OpenAI";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to get response from OpenAI");
  }
};
