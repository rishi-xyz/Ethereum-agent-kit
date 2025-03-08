import { ethers } from "ethers";
import { provider, wallet } from "../ethereum/eth";

/**
 * Get ETH Balance of an Address
 * Requires address:string [Ethereum address to get the balance] 
*/

type getEthBalanceProps = {
    address: string,
}

export async function getEthBalance({ address }: getEthBalanceProps): Promise<string> {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
}

/**
 * Send Eth to Another Address
 * Requires to:string [Address to send Ethereum] amount:string [Amount] 
*/

type sendEthProps = {
    to: string,
    amount: string,
}

export async function sendEth({ to, amount }: sendEthProps) {
    const tx = await wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount),
    });
    console.log(`Transaction Hash: ${tx.hash}`);
    await tx.wait();
    return tx.hash;
}

/**
 * Read Data from a Smart Contract
 * Requires
 *  contractAddress: string [Address of Smart Address]
    abi: any [Application Binary Interface]
    functionName: string [Name of the function]
    args: any[] [Arugments if any]
*/

type ContractProps = {
    contractAddress: string,
    abi: any,
    functionName: string,
    args: any[],
}

export async function readContract({ contractAddress, abi, functionName, args }: ContractProps) {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    return await contract[functionName](...args);
}

/**
 * Write Smart Contract
 * Requires
 *  contractAddress: string [Address of Smart Address]
    abi: any [Application Binary Interface]
    functionName: string [Name of the function]
    args: any[] [Arugments if any]
*/

export async function writeContract({ contractAddress, abi, functionName, args }: ContractProps) {
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    const tx = await contract[functionName](...args);
    console.log(`Transaction Hash: ${tx.hash}`);
    await tx.wait();
    return tx.hash;
}