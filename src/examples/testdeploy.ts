import { deployERC20 } from "../blockchain";

async function testdeployERC20() {
    const tokenAdd = deployERC20({
        abi: "./src/examples/test.abi.json",
        bytecode: "./src/examples/test.bytecode.txt",
        tokenName: "test",
        tokenSymbol: "TST",
    })
    return tokenAdd
}

testdeployERC20();