import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../config/config";
import { balanceTool, getEthBalance, sendEth, sendEthTool, uploadContractFile, uploadContractTool } from "../blockchain/blockchain";
import { SYSTEM_INSTRUCTIONS } from "./agent-instructions";
import fs from "fs";

const CHAT_HISTORY_FILE = "chat-history.json";

class GeminiAgent {
    private genAI;
    private model;
    private chatHistory: any[];

    constructor(model:string) {
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

    private loadChatHistory(): any[] {
        if (fs.existsSync(CHAT_HISTORY_FILE)) {
            return JSON.parse(fs.readFileSync(CHAT_HISTORY_FILE, "utf-8"));
        }
        return [];
    }

    private saveChatHistory() {
        fs.writeFileSync(CHAT_HISTORY_FILE, JSON.stringify(this.chatHistory, null, 2));
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

    public getChatHistory() {
        return this.chatHistory;
    }
}

export default GeminiAgent;
