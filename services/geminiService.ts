import { GoogleGenAI, Chat } from "@google/genai";
import { DocPage } from "../types";

// Initialize Gemini Client
// IMPORTANT: In a real production app, this should be proxied through a backend
// to protect the API key. For this demo, we use the env variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (currentDoc: DocPage | undefined): Chat => {
  const context = currentDoc 
    ? `The user is currently reading the documentation page titled "${currentDoc.title}".
       
       Content of the current page:
       ${currentDoc.content}
       `
    : "The user is browsing the documentation.";

  const systemInstruction = `You are Nebula AI, a helpful, technical, and concise documentation assistant for "Nebula UI".
  
  Your goal is to help developers understand the library, fix code issues, and find information.
  
  Context:
  ${context}
  
  Rules:
  1. Be concise. Developers want quick answers.
  2. Use code blocks for examples.
  3. If the answer is in the "Content of the current page" provided above, explicitly reference it.
  4. If you don't know the answer based on general web knowledge or the provided context, politely say so.
  5. Assume the user is a developer using React and TypeScript.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.3, // Low temperature for more factual responses
    },
  });
};
