import * as dotenv from "dotenv";

dotenv.config();

export const aiConfig = {
    gemini: {
        apiKey: process.env.GEMINI_API_KEY || "",
        modelName: "gemini-2.5-flash",
    },
};
