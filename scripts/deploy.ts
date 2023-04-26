import { ethers, upgrades, defender, run } from "hardhat";
import {writeFileSync} from "fs";
const {
    DefenderRelayProvider,
    DefenderRelaySigner,
} = require('defender-relay-client/lib/ethers')
async function main() {
    require('dotenv').config()

    // Upgradeable custom token
    // const CustomToken = await ethers.getContractFactory("CustomToken");
    // const initialSupply = 1000;
    // const mintInterval = 60 * 60 * 24; // 1 day
    //
    // console.log("Deploying CustomToken...");
    // const customToken = await upgrades.deployProxy(CustomToken, ["CustomToken", "CTK", initialSupply, mintInterval], { initializer: "initialize" });
    // // const customToken = await ethers.deployContract("CustomToken")
    // await customToken.deployed();
    // console.log("CustomToken deployed to:", customToken.address);
    //   // await proposeUpgrade(customToken.address);
    //   // await proposeUpgrade('0xd25625B8Df6204037Ff0Ef82dbc2F39741e3A0D4');

    const credentials = {
        apiKey: process.env.RELAYER_API_KEY,
        apiSecret: process.env.RELAYER_API_SECRET,
    }
    const provider = new DefenderRelayProvider(credentials)
    const relaySigner = new DefenderRelaySigner(credentials, provider, {
        speed: 'fast',
    })

    const Forwarder = await ethers.getContractFactory('MinimalForwarder')
    const forwarder = await Forwarder.connect(relaySigner)
        .deploy()
        .then((f) => f.deployed())

    try {
        await run('verify:verify', {
            address: forwarder.address,
            constructorArguments: [],
        })
    } catch (e) {
        console.log(e)
    }

    // // TokenMetaTx
    // const initialSupply = ethers.utils.parseEther('1000')
    // const TokenMetaTx = await ethers.getContractFactory('TokenMetaTx')
    // const tokenMetaTx = await TokenMetaTx.connect(relaySigner)
    //     .deploy(initialSupply, forwarder.address)
    //     .then((f) => f.deployed())
    //
    // try {
    //     await run('verify:verify', {
    //         address: tokenMetaTx.address,
    //         constructorArguments: [initialSupply, forwarder.address],
    //     })
    // } catch (e) {
    //     console.log(e)
    // }
    // writeFileSync(
    //     'deploy.json',
    //     JSON.stringify(
    //         {
    //             MinimalForwarder: forwarder.address,
    //             TokenMetaTx: tokenMetaTx.address,
    //         },
    //         null,
    //         2
    //     )
    // )
    // console.log(
    //     `MinimalForwarder: ${forwarder.address}\nTokenMetaTx: ${tokenMetaTx.address}`
    // )

    // SimpleNftFactory
    const SimpleNftFactory = await ethers.getContractFactory('SimpleNftFactory')
    const simpleNftFactory = await SimpleNftFactory.connect(relaySigner)
        .deploy(forwarder.address)
        .then((f) => f.deployed())

    try {
        await run('verify:verify', {
            address: simpleNftFactory.address,
            constructorArguments: [forwarder.address],
        })
    } catch (e) {
        console.log(e)
    }
    writeFileSync(
        'deploy2.json',
        JSON.stringify(
            {
                MinimalForwarder: forwarder.address,
                SimpleNftFactory: simpleNftFactory.address,
            },
            null,
            2
        )
    )
    console.log(
        `MinimalForwarder: ${forwarder.address}\nSimpleNftFactory: ${simpleNftFactory.address}`
    )
}

// async function proposeUpgrade(customTokenAddress: string) {
//   const CustomTokenV2 = await ethers.getContractFactory("CustomTokenV2");
//   const proposal = await defender.proposeUpgrade(customTokenAddress, CustomTokenV2);
//   console.log("Upgrade proposal created at:", proposal.url);
// }

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
