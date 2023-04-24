// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NftFactory.sol";

contract NftFactoryV2 is NftFactory {
    event Log(string message);

    constructor(MinimalForwarderUpgradeable forwarder) NftFactory(forwarder) {}

    function initializeV2() public reinitializer(2) {
        initialize();
    }

    function log(string memory message) public {
        emit Log(message);
    }
}
