import { ethers } from "ethers";
import { wallet } from "../../../ethereum/eth";
import { sendEthProps } from "../../../types/functions";

/**
 * Function to send ethereum to a address
 * @param sendEthProps - The address and amount of ethereum to send
 * @returns The hash of the transaction
 * @throws If the address is not a valid Ethereum address
 */

export async function sendEth({ to, amount }: sendEthProps) {
    const tx = await wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount),
    });
    await tx.wait();
    return tx.hash;
}