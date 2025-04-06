import { GoogleGenerativeAI, GenerativeModel, Tool } from "@google/generative-ai";
import fs from "fs";
import { config } from "../config/config";
import { balanceTool, deployERC20, deployERC20Tool, getEthBalance, sendEth, sendEthTool } from "../blockchain";
import { SYSTEM_INSTRUCTIONS } from "./agent-instructions";
import prisma from "../config/database";
import { ChatMessage } from "../types";

/**
 * Create a Gemini AI-based agent that can interact with the Ethereum blockchain.
 * 
 * @param model - The model to use for the agent.
 * @param history_file - The file to save the chat history to.
 */

class EthereumAgent {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;
    private chatHistory: ChatMessage[];
    private CHAT_HISTORY_FILE: string;
    private ethereumTools: Tool[] = [
        balanceTool,
        sendEthTool,
        deployERC20Tool,
    ];

    constructor({
        model,
        history_file
    }: {
        model: string,
        history_file?: string
    }) {
        if (!config.geminiApiKey) {
            throw new Error("GEMINI_API_KEY is not set");
        };
        this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
        this.model = this.genAI.getGenerativeModel({
            model: model,
            tools: this.ethereumTools,
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
            }
            else if (name === "createERC20") {
                console.log("Arguments given by gemini:", args)//WIP:Remove
                const address = await deployERC20({
                    abi: args.abi,
                    bytecode: args.bytecode,
                    tokenName: args.tokenName,
                    tokenSymbol: args.tokenSymbol,
                    decimals: args.decimals ?? 18,
                    initialsupply: args.initialsupply ?? "1000000",
                });
                console.log("Address Response: ", address)//WIP:Remove
                return { address };
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
            history: this.chatHistory
                .filter((msg) => msg.content && msg.content.trim() !== "")
                .map((msg) => ({
                    role: msg.role,
                    parts: [{ text: msg.content }],
                })),
        });

        if (!message || message.trim() === "") {
            throw new Error("Cannot send empty message to Gemini.");
        }

        let result = await chat.sendMessage(message);

        while (true) {
            console.log("Gemini raw response:", result); // Debug
            const parts = result.response?.candidates?.[0]?.content?.parts || [];
            console.log("Parts:", parts); // Debug

            const functionCalls = parts.filter(part => part.functionCall);
            console.log("FunctionCalls:", functionCalls); // Debug

            if (functionCalls.length === 0) {
                const responseText = result.response.text();
                this.chatHistory.push({ role: "model", content: responseText });
                this.saveChatHistory();
                return responseText;
            }

            for (const part of functionCalls) {
                const call = part.functionCall;
                if (!call) continue;

                console.log("Calls", call); // Debug

                const apiResponse = await this.handleFunctionCall(call.name, call.args);
                console.log("apiResponse:", apiResponse); // Debug

                result = await chat.sendMessage([
                    {
                        functionResponse: {
                            name: call.name,
                            response: apiResponse,
                        },
                    },
                ]);
            }
        }
    }

    async processQueryFromDatabase(message: string) {
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

export { EthereumAgent };
