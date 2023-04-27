import deploy2 from '../deploy2.json';
import {ethers, run, upgrades} from "hardhat";
import {writeFileSync} from "fs";
import {DefenderRelayProvider, DefenderRelaySigner} from "defender-relay-client/lib/ethers";
async function main() {
    const credentials = {
        apiKey: process.env.RELAYER_API_KEY as string,
        apiSecret: process.env.RELAYER_API_SECRET as string,
    }
    const provider = new DefenderRelayProvider(credentials)
    const relaySigner = new DefenderRelaySigner(credentials, provider, {
        speed: 'fast',
    })

    const NftFactory = await ethers.getContractFactory('SimpleNftFactory');
    const nftFactory = await upgrades.deployProxy(NftFactory.connect(relaySigner), [], {
        constructorArgs: [deploy2.MinimalForwarder],
        unsafeAllow: ["constructor"]
    });
    await nftFactory.deployed();

    try {
        await run('verify:verify', {
            address: nftFactory.address,
            constructorArguments: [deploy2.MinimalForwarder],
        })
    } catch (e) {
        console.log(e)
    }

    writeFileSync(
        'deploy3.json',
        JSON.stringify(
            {
                MinimalForwarder: deploy2.MinimalForwarder,
                NftFactory: nftFactory.address,
            },
            null,
            2
        )
    )

    console.log(
        `MinimalForwarder: ${deploy2.MinimalForwarder}\nNftFactory: ${nftFactory.address}`
    )
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
