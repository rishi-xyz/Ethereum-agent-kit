import GeminiAgent from "../agent/agent";

async function testGeminiAgent() {
    const agent = new GeminiAgent("gemini-2.0-flash");


    console.log("\nTesting balance check function...");
    const response2 = await agent.processQuery("what is Ethereum balance of address 0x52dfB13AA4B3cbE4E40f9B49f411bd38592E7FE4");
    console.log("Response:", response2);

    console.log("\nTesting last balance check function...");
    const response1 = await agent.processQuery("what was the last Ethereum balance of address 0x52dfB13AA4B3cbE4E40f9B49f411bd38592E7FE4");
    console.log("Response:", response1);

    console.log("\nChat History:", agent.getChatHistory());
}

testGeminiAgent().catch(console.error);
