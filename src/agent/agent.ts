import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../config/config";
import { balanceTool, getEthBalance, weatherTool } from "../blockchain/blockchain";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    tools: [weatherTool,balanceTool],
});

// export async function blockFn(msg:string) {
//     const chat = model.startChat();
//     const result =  await chat.sendMessageStream(msg);

//     const parts = (await result.response).candidates?.[0]?.content.parts || [];
//     const functionCall = parts.filter(part=>part.functionCall);

//     for(const part of functionCall){
//         const call = part.functionCall;
//         if(!call) continue;

//         const apiResponse = await getEthBalance({address:call.name})
//     }
// }

async function handleFunctionCall(name: string, args: any): Promise<object> {
    if (name === "getWeather") {
        return { weather: `The weather in ${args.city} is sunny` }; // Replace with actual API call
    }else if(name== "EthBalance"){
        const bal = await getEthBalance({address:args.address})
        return {
            balance:`The balance of the address:${args.address} is ${bal}`
        }
    }
    return {}; // \u2705 Always return an object (prevents `undefined` error)
}

export async function processQuery(messages: string) {

    const chat = model.startChat();
    const result = await chat.sendMessage(messages);
    console.log(`result => ${await result.response}\n`)

    // \u2705 Corrected: Extract function calls from `parts`
    const parts = result.response?.candidates?.[0]?.content?.parts || [];
    const functionCalls = parts.filter(part => part.functionCall); // Extract only function calls
    console.log(`\nfunction calls => ${functionCalls}`)
    for (const part of functionCalls) {
        const call = part.functionCall; // \u2705 Now it exists
        console.log(`\ncall => ${call}\n`)
        if (!call) continue;

        // Call the function manually
        const apiResponse = await handleFunctionCall(call.name, call.args);
        console.log(`apiResponse => ${apiResponse}`)
        // Send API response back to Gemini
        const result2 = await chat.sendMessage([
            {
                functionResponse: {
                    name: call.name, // \u2705 Use actual function name
                    response: apiResponse, // \u2705 Always an object
                },
            },
        ]);

        // Log the text response
        console.log(await result2.response.text()); // \u2705 Await `text()`
    }
}