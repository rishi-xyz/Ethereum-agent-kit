import { ethers, Provider, Wallet } from "ethers";
import { provider, wallet } from "./src/ethereum/eth";
import { processQuery } from "./src/agent/agent";

async function test() {
    const query = await processQuery(["What is Ethereum"]);
    const response = query.candidates?.[0]?.content?.parts?.[0]?.text || "No Response"
    console.log("Gemini AI response:\n", response);
}

test();