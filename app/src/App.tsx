import React from 'react';
import './App.css';
import {Button} from "react-bootstrap";
import { ethers } from "ethers";
import SimpleNftAbi from "./abi/SimpleNft.json";
import SimpleNftFactoryAbi from "./abi/SimpleNftFactory.json";

function App() {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(process.env.REACT_APP_SIMPLE_NFT_FACTORY_ADDRESS as string, SimpleNftFactoryAbi, signer);
    const [isConnected, setIsConnected] = React.useState(false);
    const createNft = async () => {
        console.log('contract: ', nftContract)
        const tx = await nftContract.createNft("Test NFT Relayer", "TR", await signer.getAddress());
        console.log(tx);
    }

    const createNftZeroFee = async () => {
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
