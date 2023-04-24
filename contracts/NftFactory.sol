// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleNft.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/MinimalForwarderUpgradeable.sol";

contract NftFactory is Initializable, AccessControlUpgradeable, ERC2771ContextUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event NftCreated(address indexed nftAddress, address indexed owner);

    constructor(MinimalForwarderUpgradeable forwarder) ERC2771ContextUpgradeable(address(forwarder)) {}

    function initialize() public initializer {
        __AccessControl_init();
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

    function _msgSender() internal view override(ContextUpgradeable, ERC2771ContextUpgradeable) returns (address) {
        return ERC2771ContextUpgradeable._msgSender();
    }

    function _msgData() internal view override(ContextUpgradeable, ERC2771ContextUpgradeable) returns (bytes calldata) {
        return ERC2771ContextUpgradeable._msgData();
    }

}
