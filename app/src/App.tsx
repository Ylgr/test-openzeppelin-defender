import React from 'react';
import './App.css';
import {Button} from "react-bootstrap";
import { ethers } from "ethers";
import MinimalForwarderAbi from "./abi/MinimalForwarder.json";
import SimpleNftFactoryAbi from "./abi/SimpleNftFactory.json";

function App() {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftFactory = new ethers.Contract(process.env.REACT_APP_SIMPLE_NFT_FACTORY_ADDRESS as string, SimpleNftFactoryAbi, signer);
    const forwarder = new ethers.Contract(process.env.REACT_APP_MINIMAL_FORWARDER_ADDRESS as string, MinimalForwarderAbi, signer);
    const [isConnected, setIsConnected] = React.useState(false);
    const createNft = async () => {
        console.log('contract: ', nftFactory)
        const tx = await nftFactory.createNft("Test NFT Relayer", "TR", await signer.getAddress());
        console.log(await tx.wait());
    }

    const createNftZeroFee = async () => {
        const url = process.env.REACT_APP_WEBHOOK_URL;
        if (!url) throw new Error(`Missing relayer url`);
        const userAddress = await signer.getAddress();

        const data = nftFactory.interface.encodeFunctionData('createNft', ["Test NFT Relay Zero Fee", "TRZF", userAddress]);
        const chainId = await provider.getNetwork().then(network => network.chainId);
        const request = {
            value: 0,
            gas: 1e6,
            nonce: (await forwarder.getNonce(userAddress)).toString(),
            from: userAddress,
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
            ForwardRequest: [
                { name: "from", type: "address" },
                { name: "to", type: "address" },
                { name: "value", type: "uint256" },
                { name: "gas", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "data", type: "bytes" },
            ],
        }

        const signature = await signer._signTypedData(domain, types, request);
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify({request, signature}),
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return (
    <div className="App">

        <Button variant="primary" onClick={() => {
            // @ts-ignore
            window.ethereum.request({method: 'eth_requestAccounts'})
                .then(() => setIsConnected(true))
        }} disabled={isConnected}>Connect</Button>
        <br/>
      <Button variant="primary" onClick={() => createNft()} disabled={!isConnected}>Create Nft</Button>
      <Button variant="info" onClick={() => createNftZeroFee()} disabled={!isConnected}>Create Nft Zero fee</Button>
    </div>
  );
}

export default App;
