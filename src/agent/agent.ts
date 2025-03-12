import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../config/config";
import { balanceTool, getEthBalance, sendEth, sendEthTool } from "../blockchain/blockchain";
import { SYSTEM_INSTRUCTIONS } from "./agent-instructions";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    tools: [balanceTool, sendEthTool],
    systemInstruction: SYSTEM_INSTRUCTIONS
});

async function handleFunctionCall(name: string, args: any): Promise<object> {
    if (name == "EthBalance") {
        const bal = await getEthBalance({ address: args.address })
        return {
            balance: `The balance of the address:${args.address} is ${bal}`
        };
    } else if (name == "sendEth") {
        const hash = await sendEth({ to: args.to, amount: args.amount })
        return {
            transaction_hash: `The Transaction of Ethereum is ${hash}`
        };
    }
    return {}; // \u2705 Always return an object (prevents `undefined` error)
}

export async function processQuery(messages: string) {
    const chat = model.startChat();
    const result = await chat.sendMessage(messages);
    const parts = result.response?.candidates?.[0]?.content?.parts || [];
    const functionCalls = parts.filter(part => part.functionCall); // Extract only function calls
    if (functionCalls.length === 0) {
        //No function call detected, respond normally
        const textResponse = await result.response.text();
        return textResponse;
    }
    for (const part of functionCalls) {
        const call = part.functionCall;
        if (!call) continue;

        // Call the appropriate function
        const apiResponse = await handleFunctionCall(call.name, call.args);

        // Send API response back to Gemini to send a natural response
        const result2 = await chat.sendMessage([
            {
                functionResponse: {
                    name: call.name,
                    response: apiResponse,
                },
            },
        ]);

        // Log the AI-generated natural response 
        const textResponse = result2.response.text();
        return textResponse;
    }
}
