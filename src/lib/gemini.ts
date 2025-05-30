import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function analyzeIdea(idea: string) {
  const prompt = `Analyze this hackathon project idea and provide:
  1. A brief summary
  2. SWOT analysis
  3. Monetization potential (score 1-10)
  4. Technical feasibility (score 1-10)
  5. Social impact potential (score 1-10)
  
  Idea: ${idea}`;

  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  return response.text();
}