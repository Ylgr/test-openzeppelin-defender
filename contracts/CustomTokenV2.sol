// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CustomToken.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract CustomTokenV2 is CustomToken {
    uint256 public maxSupply;

    function initializeV2(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _mintInterval,
        uint256 _maxSupply
    ) reinitializer(2) public onlyAdmin {
        require(maxSupply == 0, "CustomTokenV2: Already initialized");
        __ERC20_init(name, symbol);
        mintInterval = _mintInterval;
        _mint(msg.sender, initialSupply);
        lastMintTimestamp = block.timestamp;
        maxSupply = _maxSupply;
    }

    function mint(address to, uint256 amount) public override onlyAdmin {
        require(totalSupply() + amount <= maxSupply, "CustomToken: Max supply reached");
        super.mint(to, amount);
    }
}
