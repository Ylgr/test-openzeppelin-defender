import {Contract, Wallet} from "ethers";
import { NftFactory, MinimalForwarderUpgradeable } from "../typechain-types";
import {ethers, upgrades} from "hardhat";
import {expect} from "chai";

describe("NftFactory", () => {
    let NftFactory, nftFactory: Contract, admin, addr1, addr2;
    let forwarder: MinimalForwarderUpgradeable;
    beforeEach(async () => {
        NftFactory = await ethers.getContractFactory("NftFactory");
        [admin, addr1, addr2] = await ethers.getSigners();
        forwarder = await ethers.getContractFactory("MinimalForwarderUpgradeable").then((factory) => factory.deploy());

        // nftFactory = await NftFactory.deploy(forwarder.address);
        nftFactory = await upgrades.deployProxy(NftFactory, [], {
            constructorArgs: [forwarder.address],
            unsafeAllow: ["constructor"]
        });
        await nftFactory.deployed();
    });

    describe("Upgrade", () => {
        it("Should upgrade the contract", async () => {
            const NftFactoryV2 = await ethers.getContractFactory("NftFactoryV2");
            const nftFactoryV2 = await upgrades.upgradeProxy(nftFactory.address, NftFactoryV2, {
                constructorArgs: [forwarder.address],
                unsafeAllow: ["constructor"]
            });
            await nftFactoryV2.deployed();

            await expect(nftFactoryV2.log("Hello World")).to.emit(nftFactoryV2, "Log");
        });
    });
});
