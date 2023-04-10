// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract CustomToken is Initializable, ERC20Upgradeable {
    address public admin;
    uint256 public lastMintTimestamp;
    uint256 public mintInterval;

    event AdminChanged(address indexed newAdmin);

    modifier onlyAdmin() {
        require(admin == msg.sender, "CustomToken: Not an admin");
        _;
    }

    function initialize(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _mintInterval
    ) public initializer {
        __ERC20_init(name, symbol);
        admin = msg.sender;
        mintInterval = _mintInterval;
        _mint(msg.sender, initialSupply);
        lastMintTimestamp = block.timestamp;
    }

    function changeAdmin(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "CustomToken: Invalid new admin");
        admin = newAdmin;
        emit AdminChanged(newAdmin);
    }

    function mint(address to, uint256 amount) public onlyAdmin {
        require(block.timestamp >= lastMintTimestamp + mintInterval, "CustomToken: Mint interval not reached");
        lastMintTimestamp = block.timestamp;
        _mint(to, amount);
    }
}
