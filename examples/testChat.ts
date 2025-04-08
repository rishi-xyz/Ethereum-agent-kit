import { EthereumAgent } from "../src/agent/agent";

async function testGeminiAgent() {
    const agent = new EthereumAgent({
        model: "gemini-2.0-flash",
        history_file: "chat-history.json"
    });
    const repsonse3 = await agent.processQuery("give details of this transaction 0x6c48078c1a3c625622de0808b975e61510fdaf122b17615915277833cfef6d8f");
    console.log("Response:", repsonse3);
}

testGeminiAgent().catch(console.error);
