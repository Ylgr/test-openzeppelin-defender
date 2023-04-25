// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleNft.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";

contract SimpleNftFactory is AccessControl, ERC2771Context {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event NftCreated(address indexed nftAddress, address indexed owner);

    constructor(MinimalForwarder forwarder) ERC2771Context(address(forwarder)) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
    }

    function createNft(
        string memory _name,
        string memory _symbol,
        address _owner
    ) public onlyRole(MINTER_ROLE) returns (address) {
        SimpleNft nft = new SimpleNft(_name, _symbol, _owner);
        emit NftCreated(address(nft), _owner);
        return address(nft);
    }

    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

}
