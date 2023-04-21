// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";

contract TokenMetaTx is ERC20, ERC2771Context {

    constructor(uint256 initialSupply_, MinimalForwarder forwarder)
    ERC20("Token Meta Tx", "TMTx")
    ERC2771Context(address(forwarder))
    {
        _mint(_msgSender(), initialSupply_);
    }

    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

}
