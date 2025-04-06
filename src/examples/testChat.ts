import { EthereumAgent } from "../agent/agent";

async function testGeminiAgent() {
    const agent = new EthereumAgent({
        model: "gemini-2.0-flash",
        history_file: "chat-history.json"
    });
    const repsonse3 = await agent.processQuery("check the balance of 0x8a0951ea5FF7569eA6455E6362D322dd576309C9");
    console.log("Response:", repsonse3);
}

testGeminiAgent().catch(console.error);
