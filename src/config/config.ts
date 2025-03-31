import dotenv from "dotenv";

dotenv.config();

/**
 * Configuration for the application
 * @property rpcUrl - The URL of the Ethereum RPC
 * @property privateKey - The private key of the wallet
 * @property geminiApiKey - The API key for the Gemini API
 * @property databaseUrl - The URL of the database
 */

export const config = {
  rpcUrl: process.env.ETHEREUM_RPC_URL!,
  privateKey: process.env.PRIVATE_KEY!,
  geminiApiKey: process.env.GEMINI_API_KEY!,
  databaseUrl: process.env.DATABASE_URL!,
};