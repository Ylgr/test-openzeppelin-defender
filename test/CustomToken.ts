import {Wallet} from "ethers";

const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
import { CustomToken} from "../typechain-types";

describe("CustomToken", () => {
    let CustomToken, customToken: CustomToken, admin: Wallet, addr1, addr2;
    const initialSupply = 1000;
    const mintInterval = 60 * 60 * 24; // 1 day

    beforeEach(async () => {
        CustomToken = await ethers.getContractFactory("CustomToken");
        [admin, addr1, addr2] = await ethers.getSigners();
        customToken = await upgrades.deployProxy(CustomToken, ["CustomToken", "CTK", initialSupply, mintInterval], { initializer: "initialize" });
        await customToken.deployed();
    });

    describe("Deployment", () => {
        it("Should set the correct initial supply", async () => {
            expect(await customToken.totalSupply()).to.equal(initialSupply);
        });

        it("Should set the correct mint interval", async () => {
            expect(await customToken.mintInterval()).to.equal(mintInterval);
        });

        it("Should assign the initial supply to the admin", async () => {
            expect(await customToken.balanceOf(admin.address)).to.equal(initialSupply);
        });
    });

    describe("Upgrade", () => {
        it("Should upgrade the contract", async () => {
            const maxSupply = 10000;
            const CustomTokenV2 = await ethers.getContractFactory("CustomTokenV2");
            const customTokenV2 = await upgrades.upgradeProxy(customToken.address, CustomTokenV2);
            await customTokenV2.deployed();
            await customTokenV2.initializeV2("CustomTokenV2", "CTK2", maxSupply, mintInterval, maxSupply);
            expect(await customTokenV2.maxSupply()).to.equal(maxSupply);
            expect(await customTokenV2.name()).to.equal("CustomTokenV2");
            expect(await customTokenV2.symbol()).to.equal("CTK2");
        });
    });
});
