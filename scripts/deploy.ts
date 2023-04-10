import { ethers, upgrades, defender } from "hardhat";
async function main() {
  const CustomToken = await ethers.getContractFactory("CustomToken");
  const initialSupply = 1000;
  const mintInterval = 60 * 60 * 24; // 1 day

  console.log("Deploying CustomToken...");
  const customToken = await upgrades.deployProxy(CustomToken, ["CustomToken", "CTK", initialSupply, mintInterval], { initializer: "initialize" });
  await customToken.deployed();
  console.log("CustomToken deployed to:", customToken.address);

  await proposeUpgrade(customToken.address);
  // await proposeUpgrade('0xd25625B8Df6204037Ff0Ef82dbc2F39741e3A0D4');
}

async function proposeUpgrade(customTokenAddress: string) {
  const CustomTokenV2 = await ethers.getContractFactory("CustomTokenV2");
  const proposal = await defender.proposeUpgrade(customTokenAddress, CustomTokenV2);
  console.log("Upgrade proposal created at:", proposal.url);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
