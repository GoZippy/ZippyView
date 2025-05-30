import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function analyzeIdea(idea: string) {
  const prompt = `Analyze this hackathon project idea and provide:
1. A brief summary (2-3 sentences)
2. SWOT analysis
3. Monetization potential (score 1-10)
4. Creativity score (1-10)
5. Technical feasibility (1-10)

Idea: ${idea}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}