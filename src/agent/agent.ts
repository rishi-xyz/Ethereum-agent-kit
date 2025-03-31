import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import fs from "fs";
import { config } from "../config/config";
import { balanceTool, getEthBalance, sendEth, sendEthTool, uploadContractFile, uploadContractTool } from "../blockchain/blockchain";
import { SYSTEM_INSTRUCTIONS } from "./agent-instructions";
import prisma from "../config/database";
import { ChatMessage } from "../types";

/**
 * Create a Gemini AI-based agent that can interact with the Ethereum blockchain.
 * 
 * @param model - The model to use for the agent.
 * @param history_file - The file to save the chat history to.
 */

if(!config.geminiApiKey){
    throw new Error("GEMINI_API_KEY is not set");
}

class GeminiAgent {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;
    private chatHistory: ChatMessage[];
    private CHAT_HISTORY_FILE: string;

    constructor(model: string, history_file: string) {
        this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
        this.model = this.genAI.getGenerativeModel({
            model: model,
            tools: [balanceTool, sendEthTool, uploadContractTool],
            systemInstruction: SYSTEM_INSTRUCTIONS
        });
        this.CHAT_HISTORY_FILE = history_file || "chat-history.json";
        this.chatHistory = this.loadChatHistory();
    }

    private async handleFunctionCall(name: string, args: any): Promise<object> {
        try {
            if (name === "EthBalance") {
                const bal = await getEthBalance({ address: args.address });
                return { balance: `The balance of ${args.address} is ${bal}.` };
            } else if (name === "sendEth") {
                const hash = await sendEth({ to: args.to, amount: args.amount });
                return { transaction_hash: `Transaction successful! Hash: ${hash}` };
            } else if (name === "uploadContractFile") {
                const fileContents = await uploadContractFile({ filePath: args.filePath });
                return { message: `File uploaded successfully.`, fileContents };
            }
        } catch (error: any) {
            console.error("Error in function call:", error);
            return { error_message: error.message || "An unknown error occurred." };
        }
        return { error_message: "Unknown function call." };
    }

    private async saveMessageToDatabase(message: string, role: "user" | "model") {
        await prisma.chatMessage.create({
            data: { role, content: message }
        });
    }

    private async getChatHistoryFromDatabase(): Promise<ChatMessage[]> {
        const messages = await prisma.chatMessage.findMany({
            orderBy: { timestamp: "asc" }
        });
        return messages.map(msg => ({
            id: msg.id,
            role: msg.role as "user" | "model",
            content: msg.content,
            timestamp: msg.timestamp
        }));
    }

    private loadChatHistory(): ChatMessage[] {
        if (fs.existsSync(this.CHAT_HISTORY_FILE)) {
            return JSON.parse(fs.readFileSync(this.CHAT_HISTORY_FILE, "utf-8"));
        }
        return [];
    }

    private saveChatHistory() {
        fs.writeFileSync(this.CHAT_HISTORY_FILE, JSON.stringify(this.chatHistory, null, 2));
    }

    public getChatHistory(): ChatMessage[] {
        return this.chatHistory;
    }

    public async processQuery(message: string) {
        this.chatHistory.push({ role: "user", content: message });

        const chat = this.model.startChat({
            history: this.chatHistory.map((msg) => ({
                role: msg.role,
                parts: [{ text: msg.content }],
            })),
        });

        const result = await chat.sendMessage(message);
        const parts = result.response?.candidates?.[0]?.content?.parts || [];
        const functionCalls = parts.filter(part => part.functionCall);

        if (functionCalls.length === 0) {
            const responseText = result.response.text();
            this.chatHistory.push({ role: "model", content: responseText });
            this.saveChatHistory();
            return responseText;
        }

        for (const part of functionCalls) {
            const call = part.functionCall;
            if (!call) continue;

            const apiResponse = await this.handleFunctionCall(call.name, call.args);

            const result2 = await chat.sendMessage([
                {
                    functionResponse: {
                        name: call.name,
                        response: apiResponse,
                    },
                },
            ]);

            const responseText = result2.response.text();
            this.chatHistory.push({ role: "model", content: responseText });
            this.saveChatHistory();
            return responseText;
        }
    }

    async  processQueryFromDatabase(message: string){
        this.saveMessageToDatabase(message, "user");
        const history = await this.getChatHistoryFromDatabase();
        console.log("History:", history);
        const chat = this.model.startChat({
            history: history.map((msg) => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            }))
        });

        const result = await chat.sendMessage(message);
        const parts = result.response?.candidates?.[0]?.content?.parts || [];
        const functionCalls = parts.filter(part => part.functionCall);

        if (functionCalls.length === 0) {
            const responseText = result.response.text();
            this.saveMessageToDatabase(responseText, "model");
            return responseText;
        }

        for (const part of functionCalls) {
            const call = part.functionCall;
            if (!call) continue;

            const apiResponse = await this.handleFunctionCall(call.name, call.args);

            const result2 = await chat.sendMessage([
                {
                    functionResponse: {
                        name: call.name,
                        response: apiResponse,
                    },
                },
            ]);

            const responseText = result2.response.text();
            this.saveMessageToDatabase(responseText, "model");
            return responseText;
        }
    }

}

export default GeminiAgent;
