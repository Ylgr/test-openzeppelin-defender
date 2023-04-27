
import { expect } from "chai";
import { ethers } from "hardhat";
import {MinimalForwarder, TokenMetaTx} from "../typechain-types";

describe("TokenMetaTx", () => {
    let token: TokenMetaTx;
    let forwarder: MinimalForwarder;
    let owner: any;
    let user1: any;
    let user2: any;

    before(async function () {
        [owner] = await ethers.getSigners();
        // @ts-ignore
        user1 = new ethers.Wallet("0x" + "1".repeat(64), ethers.provider);
        // @ts-ignore
        user2 = new ethers.Wallet("0x" + "2".repeat(64), ethers.provider);
        forwarder = await ethers.getContractFactory("MinimalForwarder").then((factory) => factory.deploy());
        token = await ethers.getContractFactory("TokenMetaTx").then((factory) =>
            factory.deploy(100, forwarder.address)
        );
        await token.transfer(user1.address, 10);
    });

    it("should transfer tokens using meta-transaction", async function () {
        // make sure user 1 and user 2 has zero native balance
        expect(await ethers.provider.getBalance(user1.address)).to.equal(0);
        expect(await ethers.provider.getBalance(user2.address)).to.equal(0);

        const data = token.interface.encodeFunctionData("transfer", [user2.address, 10]);
        const chainId = (await ethers.provider.getNetwork()).chainId;
        const input = {
            from: user1.address,
            to: token.address,
            data: data,
        }
        const request = {
            value: 0,
            gas: 1e6,
            nonce: (await forwarder.getNonce(user1.address)).toString(),
            ...input,
        }
        const toSign = {
            types: {
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
            },
            domain: {
                name: "MinimalForwarder",
                version: "0.0.1",
                chainId: chainId,
                verifyingContract: forwarder.address,
            },
            primaryType: "ForwardRequest",
            message: request,
        }
        const signature = await user1._signTypedData(toSign.domain, toSign.types, request);

        const result = await forwarder.execute(request, signature);

        expect(result).to.emit(token, "Transfer").withArgs(user1.address, user2.address, 10);


        const balance1 = await token.balanceOf(user1.address);
        expect(balance1).to.eq(0);

        const balance2 = await token.balanceOf(user2.address);
        expect(balance2).to.eq(10);

        // at the end user 1 and user 2 still has zero native balance
        expect(await ethers.provider.getBalance(user1.address)).to.equal(0);
        expect(await ethers.provider.getBalance(user2.address)).to.equal(0);
    });
});
