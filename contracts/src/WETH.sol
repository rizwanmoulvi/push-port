// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockWrappedETH is ERC20, Ownable {
    mapping(bytes32 => bool) public processedLocks;

    event TokensMinted(address indexed to, uint256 amount, bytes32 indexed lockId);

    constructor() ERC20("Mock Wrapped ETH", "wETH") Ownable(msg.sender) {
        // Initial supply for testing
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Public mint function for demo purposes (anyone can call)
    function publicMint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function mintForLock(address to, uint256 amount, bytes32 lockId) external onlyOwner {
        require(!processedLocks[lockId], "Lock already processed");
        processedLocks[lockId] = true;

        _mint(to, amount);
        emit TokensMinted(to, amount, lockId);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
