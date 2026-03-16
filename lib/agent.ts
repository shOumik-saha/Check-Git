import { ChatGroq } from "@langchain/groq";

const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

export async function generateAnalysis(repoData: any): Promise<{
  summary: string;
  techStack: string[];
  improvements: string[];
  strengths: string[];
}> {
  const prompt = `
You are an expert software engineer. Analyze this GitHub repository and respond ONLY in valid JSON with this exact structure:
{
  "summary": "2-3 sentence description of what this project does",
  "techStack": ["tech1", "tech2", "tech3"],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"]
}

Repository data:
${JSON.stringify(repoData, null, 2)}

Return ONLY the JSON object, no markdown, no explanation.
`;

  const result = await groq.invoke(prompt);
  const text = result.content as string;

  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      summary: text,
      techStack: [repoData.language || "Unknown"].filter(Boolean),
      improvements: ["Could not parse structured response"],
      strengths: ["Repository analyzed successfully"],
    };
  }
}
