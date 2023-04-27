import { run } from 'hardhat';

const contractAddress = '0x597E9201E83B1A32DEE55c4b607421c68de6Cb07'
const ownerAddress = '0xC6C28316A74504EBA2113b0929B1b09a4c7a09F1'
async function main() {
    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: ["Test NFT Relay Zero Fee", "TRZF", ownerAddress],
        })
    } catch (e) {
        console.log(e)
    }
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
