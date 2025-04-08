import { ethers } from "ethers";
import { wallet } from "../../../ethereum/eth";
import { deployERC20Props } from "../../../types/functions";

/**
 * function to deploy ERC20 token using ABI(Application Binary Interface) and Bytecode
 * @param deployERC20Props 
 * @returns contract Address
 */

export async function deployERC20({ abi, bytecode, tokenName, tokenSymbol, decimals, initialsupply }: deployERC20Props) {
    try {
        const factoryERC20 = new ethers.ContractFactory(abi, bytecode, wallet);
        const contract = await factoryERC20.deploy(tokenName, tokenSymbol, decimals || 18, ethers.parseUnits(initialsupply || "1000000", decimals || 18));
        await contract.waitForDeployment();
        return contract.getAddress();
    } catch (error) {
        console.error("ERC20 Deployment failed",error)
        return (`Error in deployment of erc-20 ${error}`)
    }
}

