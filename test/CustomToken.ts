import {Wallet} from "ethers";

const { expect } = require("chai");
const { ethers } = require("hardhat");
import { CustomToken} from "../typechain-types";

describe("CustomToken", () => {
    let CustomToken, customToken: CustomToken, admin: Wallet, addr1, addr2;
    const initialSupply = 1000;
    const mintInterval = 60 * 60 * 24; // 1 day

    beforeEach(async () => {
        CustomToken = await ethers.getContractFactory("CustomToken");
        [admin, addr1, addr2] = await ethers.getSigners();
        customToken = await CustomToken.deploy();
        await customToken.initialize("CustomToken", "CTK", initialSupply, mintInterval);
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
});
