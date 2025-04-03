import { ethers } from "ethers";
import { wallet } from "../../../ethereum/eth";
import { deployERC20Props } from "../../../types/functions";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as fs from "fs"

/**
 * function to deploy ERC20 token using ABI(Application Binary Interface) and Bytecode
 * @param deployERC20Props 
 * @returns contract Address
 */

export async function deployERC20({ abi, bytecode, tokenName, tokenSymbol, decimals, initialsupply }: deployERC20Props) {
    try {
        const _dirAbi = JSON.parse(fs.readFileSync(abi,"utf-8")).abi;
        console.log(`dirAbi : ${_dirAbi} \n`)
        const _dirBytecode = JSON.parse(fs.readFileSync(bytecode,"utf-8")).bytecode;
        console.log(`dirBytecode : ${_dirAbi} \n`)
        const factoryERC20 = new ethers.ContractFactory(_dirAbi, _dirBytecode, wallet);
        console.log(`factoryERC20 : ${factoryERC20} \n`)
        const contract = await factoryERC20.deploy(tokenName, tokenSymbol, decimals || 18, ethers.parseUnits(initialsupply || "1000000", decimals || 18));
        console.log(`Contract : ${contract} \n`)
        await contract.waitForDeployment();
        return contract.getAddress();
    } catch (error) {
        console.error("ERC20 Deployment failed")
    }
}

