import {Contract, Signer, Wallet} from "ethers";
import { NftFactory, MinimalForwarder } from "../typechain-types";
import {ethers, upgrades} from "hardhat";
import {expect} from "chai";

describe("NftFactory", () => {
    let NftFactory, nftFactory: Contract;
    let owner: any;
    let user1: Wallet;
    let user2: any;

    let forwarder: any;
    beforeEach(async () => {
        // set gasPrice to 15Gwei
        // await ethers.provider.send("hardhat_setNextBlockBaseFeePerGas", ["0x77359400"]);
        NftFactory = await ethers.getContractFactory("NftFactory");
        [owner, user2] = await ethers.getSigners();
        // @ts-ignore
        user1 = new ethers.Wallet("0x" + "1".repeat(64), ethers.provider);
        forwarder = await ethers.getContractFactory("MinimalForwarder").then((factory) => factory.deploy());
        // const Forwarder = await ethers.getContractFactory("MinimalForwarderUpgradeable");
        // forwarder = await upgrades.deployProxy(Forwarder, [], {
        //   initializer: "initialize"
        // });

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

    describe('createNft', () => {
        it('should create a new NFT', async () => {

            const receipt = await nftFactory.createNft("NFT1", "NFT1", user2.getAddress()).then((tx: any) => tx.wait());
            const nftAddress = receipt.events.find((x: any) => (x.event === "NftCreated" && x.address === nftFactory.address)).args.nftAddress
            const nft = await ethers.getContractAt("SimpleNft", nftAddress);
            expect(await nft.name()).to.equal("NFT1");
            expect(await nft.symbol()).to.equal("NFT1");
            expect(await nft.owner()).to.equal(await user2.getAddress());
        });

        it('user 2 can not create NFT directly', async () => {
            try {
                await nftFactory.connect(user2).createNft("NFT2", "NFT2", user2.getAddress())
            } catch (error) {
                // @ts-ignore
                expect(error.message).to.contain("AccessControl");
            }
        });

        it('user 1 can create NFT 2 with zero fee using meta-transaction', async () => {
            await nftFactory.grantRole(await nftFactory.MINTER_ROLE(), user1.address);

            expect(await ethers.provider.getBalance(user1.address)).to.equal(0);
            const data = nftFactory.interface.encodeFunctionData('createNft', ["NFT3", "NFT3", user1.address]);
            const chainId = (await ethers.provider.getNetwork()).chainId;
            const request = {
                value: 0,
                gas: 10e6,
                nonce: (await forwarder.getNonce(user1.address)).toString(),
                from: user1.address,
                to: nftFactory.address,
                data
            };
            const domain = {
                name: "MinimalForwarder",
                version: "0.0.1",
                chainId: chainId,
                verifyingContract: forwarder.address,
            }
            const types = {
                // EIP712Domain: [
                //     { name: "name", type: "string" },
                //     { name: "version", type: "string" },
                //     { name: "chainId", type: "uint256" },
                //     { name: "verifyingContract", type: "address" },
                // ],
                ForwardRequest: [
                    { name: "from", type: "address" },
                    { name: "to", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "gas", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "data", type: "bytes" },
                ],
            }

            const signature = await user1._signTypedData(domain, types, request);
            const receipt = await forwarder.execute(request, signature).then((tx: any) => tx.wait());
            const nftAddress = receipt.logs
                .filter((x: any) => x.address.toLowerCase() === nftFactory.address.toLowerCase())
                .map((x: any) => nftFactory.interface.parseLog(x))
                .find((x: any) => x.name === "NftCreated").args.nftAddress;
            const nft = await ethers.getContractAt("SimpleNft", nftAddress);
            expect(await nft.name()).to.equal("NFT3");
            expect(await nft.symbol()).to.equal("NFT3");
            expect(await nft.owner()).to.equal(user1.address);
        })
    });
});
