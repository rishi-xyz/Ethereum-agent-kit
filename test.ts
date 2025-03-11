import { ethers, Provider, Wallet } from "ethers";
import { provider, wallet } from "./src/ethereum/eth";
import { processQuery } from "./src/agent/agent";

async function test() {
    processQuery("check balance for the address 0x52dfB13AA4B3cbE4E40f9B49f411bd38592E7FE4")
    .then(() => console.log("✅ Test completed!"))
    .catch((err) => console.error("❌ Error:", err));

}

test();