import { ethers, Provider, Wallet } from "ethers";
import { provider, wallet } from "./src/ethereum/eth";

async function test() {
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet Address: ${wallet.address}`);
    console.log(`Eth balance: ${ethers.formatEther(balance)} ETH`);
}

test();