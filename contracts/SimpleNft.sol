// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SimpleNft is Ownable, ERC721URIStorage {

    constructor(string memory _name, string memory _symbol, address _owner) ERC721(_name, _symbol) {
        transferOwnership(_owner);
    }

    function mint(address _to, uint256 _tokenId, string memory _tokenURI) public onlyOwner {
        _safeMint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
    }
}
