import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { config } from "../config/config";
import { balanceTool, getEthBalance, sendEth, sendEthTool, uploadContractFile, uploadContractTool } from "../blockchain/blockchain";
import { SYSTEM_INSTRUCTIONS } from "./agent-instructions";
import prisma from "../config/database";

const CHAT_HISTORY_FILE = "chat-history.json";

type ChatMessage = {
    id?: string;
    role: "user" | "model";
    content: string;
    timestamp?: Date;
};

class GeminiAgent {
    private genAI;
    private model;
    private chatHistory: ChatMessage[];

    constructor(model: string) {
        this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
        this.model = this.genAI.getGenerativeModel({
            model: model,
            tools: [balanceTool, sendEthTool, uploadContractTool],
            systemInstruction: SYSTEM_INSTRUCTIONS
        });
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
        if (fs.existsSync(CHAT_HISTORY_FILE)) {
            return JSON.parse(fs.readFileSync(CHAT_HISTORY_FILE, "utf-8"));
        }
        return [];
    }

    private saveChatHistory() {
        fs.writeFileSync(CHAT_HISTORY_FILE, JSON.stringify(this.chatHistory, null, 2));
    }

    public getChatHistory(): ChatMessage[] {
        return this.chatHistory;
    }

    public async processQuery(message: string) {
        this.chatHistory.push({ role: "user", content: message });

        // Start a chat with the history included
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

            // Send the response (or error message) to Gemini
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
