import dotenv from "dotenv";

dotenv.config();

export const config = {
  rpcUrl: process.env.ETHEREUM_RPC_URL!,
  privateKey: process.env.PRIVATE_KEY!,
  geminiApiKey: process.env.GEMINI_API_KEY!,
};