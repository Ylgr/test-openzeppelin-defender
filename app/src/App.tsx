import React from 'react';
import './App.css';
import {Button} from "react-bootstrap";
import { ethers } from "ethers";
import SimpleNftAbi from "./abi/SimpleNft.json";

function App() {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", SimpleNftAbi, signer);

    const createNft = async () => {
        const tx = await contract.createNft();
        console.log(tx);
    }

    const createNftZeroFee = async () => {
    }

  return (
    <div className="App">
      <Button variant="primary" onClick={() => createNft()}>Create Nft</Button>
      <Button variant="info" onClick={() => createNftZeroFee()}>Create Nft Zero fee</Button>
    </div>
  );
}

export default App;
