
import { GoogleGenAI, Type } from "@google/genai";
import type { StatementData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    issuerName: { 
      type: Type.STRING, 
      description: "The name of the credit card issuer (e.g., 'Chase', 'American Express', 'Capital One'). Find it in logos or headers." 
    },
    cardLastFour: { 
      type: Type.STRING, 
      description: "The last four digits of the credit card number, often prefixed with 'Account ending in'." 
    },
    statementPeriod: { 
      type: Type.STRING, 
      description: "The billing cycle or statement period (e.g., '01/01/2024 - 01/31/2024')." 
    },
    paymentDueDate: { 
      type: Type.STRING, 
      description: "The date the payment is due." 
    },
    totalAmountDue: { 
      type: Type.STRING, 
      description: "The total amount, new balance, or minimum payment due. Prioritize the 'New Balance'." 
    },
  },
  required: ['issuerName', 'cardLastFour', 'statementPeriod', 'paymentDueDate', 'totalAmountDue']
};


export async function parseStatement(imageParts: { mimeType: string; data: string }[]): Promise<StatementData> {
  try {
    const textPrompt = {
      text: "These images are pages from a credit card statement PDF. Please analyze them, extract the required information, and return it as a single JSON object. Pay attention to layout and text, even if it's part of an image."
    };

    const contents = {
      parts: [textPrompt, ...imageParts.map(image => ({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      }))]
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            systemInstruction: "You are an expert financial assistant AI. Your task is to accurately extract key information from images of a credit card statement. You must only return a single JSON object with the specified structure. Do not add any explanatory text, markdown formatting, or anything else outside of the JSON object. For any field you cannot find, return an empty string.",
        },
    });

    const jsonString = response.text;
    const parsedData = JSON.parse(jsonString) as StatementData;
    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to parse statement using AI. The API might be unavailable or the content could not be processed.");
  }
}
