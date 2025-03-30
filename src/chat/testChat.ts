import GeminiAgent from "../agent/agent";

async function testGeminiAgent() {
    const agent = new GeminiAgent("gemini-2.0-flash");

    const response2 = await agent.processQuery("0x52dfB13AA4B3cbE4E40f9B49f411bd38592E7FE4 is my second public address");
    const repsonse3 = await agent.processQuery("What is balance of my second public address");
    console.log("Response:", response2);
    console.log("Response:", repsonse3);
}

testGeminiAgent().catch(console.error);
