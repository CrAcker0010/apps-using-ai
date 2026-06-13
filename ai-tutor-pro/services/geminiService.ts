import { GoogleGenAI, Type } from "@google/genai";
import type { Question, Resources } from '../types';

// Fix: Per coding guidelines, the API key is assumed to be set in the environment, so the check is removed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: 'A list of 3-5 quiz questions.',
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: 'The quiz question text.'
                    },
                    options: {
                        type: Type.ARRAY,
                        description: 'An array of 4 possible answers.',
                        items: { type: Type.STRING }
                    },
                    correctAnswer: {
                        type: Type.STRING,
                        description: 'The correct answer from the options.'
                    }
                },
                required: ['question', 'options', 'correctAnswer']
            }
        }
    },
    required: ['questions']
};

// Fix: Added a response schema to ensure the learning path is always a JSON array of strings.
const learningPathSchema = {
    type: Type.ARRAY,
    description: "An ordered list of 10 beginner to intermediate topics for a subject.",
    items: {
        type: Type.STRING,
        description: "The name of a single learning topic."
    }
};

const lessonSchema = {
    type: Type.OBJECT,
    properties: {
        content: {
            type: Type.STRING,
            description: "The lesson content in markdown format (300-500 words)."
        },
        resources: {
            type: Type.OBJECT,
            properties: {
                books: {
                    type: Type.ARRAY,
                    description: "An array of 2-3 relevant book recommendations.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            author: { type: Type.STRING }
                        },
                        required: ["title", "author"]
                    }
                },
                videos: {
                    type: Type.ARRAY,
                    description: "An array of 2-3 relevant YouTube video links.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            url: { type: Type.STRING, description: "A full YouTube URL." }
                        },
                        required: ["title", "url"]
                    }
                }
            },
            required: ["books", "videos"]
        }
    },
    required: ["content", "resources"]
};


export const generateLearningPath = async (subjectName: string): Promise<string[]> => {
  try {
    // Fix: Using a response schema for reliable JSON output allows for a simpler prompt and response handling.
    const prompt = `Generate a comprehensive, ordered list of 10 beginner to intermediate topics for learning ${subjectName}.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: learningPathSchema
      }
    });

    // Fix: The response schema ensures the format is correct, so redundant validation is removed.
    const path = JSON.parse(response.text);
    return path;
  } catch (error) {
    console.error("Error generating learning path:", error);
    throw new Error("Failed to generate learning path.");
  }
};

export const generateCustomLearningPath = async (goal: string): Promise<string[]> => {
  try {
    const prompt = `Based on the learning goal: "${goal}", generate a comprehensive, ordered list of 10 beginner to intermediate topics. The topics should form a logical learning path to achieve this goal.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: learningPathSchema
      }
    });
    const path = JSON.parse(response.text);
    return path;
  } catch (error) {
    console.error("Error generating custom learning path:", error);
    throw new Error("Failed to generate custom learning path.");
  }
};


export const generateLessonContent = async (subjectName: string, topicName: string): Promise<{ content: string; resources: Resources; }> => {
  try {
    const prompt = `You are an expert tutor. Create a lesson on "${topicName}" within the subject of ${subjectName}. The lesson should include:
1.  A clear, step-by-step explanation of the concept for a beginner (300-500 words) in markdown.
2.  A list of 2-3 book recommendations for further reading.
3.  A list of 2-3 relevant YouTube video links to supplement the learning.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
      }
    });
    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Error generating lesson content:", error);
    throw new Error("Failed to generate lesson content.");
  }
};

export const generateExplanationForTopic = async (topicName: string): Promise<{ content: string; resources: Resources; }> => {
  try {
    const prompt = `You are an expert tutor. Create a lesson on "${topicName}". The topic might be broad, so provide a foundational overview suitable for a beginner. The lesson should include:
1.  A clear, step-by-step explanation of the concept (300-500 words) in markdown.
2.  A list of 2-3 book recommendations for further reading.
3.  A list of 2-3 relevant YouTube video links to supplement the learning.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
      }
    });
    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Error generating explanation:", error);
    throw new Error("Failed to generate explanation.");
  }
};

export const generateQuiz = async (subjectName: string, topicName: string): Promise<Question[]> => {
    try {
        const prompt = `Create a 3-question multiple-choice quiz on the topic of "${topicName}" for a ${subjectName} student. For each question, provide 4 options, and indicate the correct answer. The difficulty should be suitable for a beginner who has just learned the topic.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            }
        });

        const result = JSON.parse(response.text);
        return result.questions as Question[];

    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz.");
    }
};

export const reexplainConcept = async (content: string): Promise<string> => {
    try {
        const prompt = `Re-explain the following concept in a simpler way, using an analogy if possible. Use markdown formatting. Concept:\n\n---\n\n${content}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    // FIX: Added curly braces around the catch block to fix a syntax error.
    } catch (error) {
        console.error("Error re-explaining concept:", error);
        throw new Error("Failed to re-explain concept.");
    }
};

export const generateNotesFromDocument = async (documentText: string): Promise<string> => {
    try {
        const prompt = `Please summarize the following document and convert it into concise, easy-to-read notes. Use markdown for formatting, including headers and bullet points to structure the information clearly. Focus on the key concepts, definitions, and main points.\n\n---\n\nDOCUMENT CONTENT:\n\n${documentText}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating notes from document:", error);
        throw new Error("Failed to generate notes from document.");
    }
};