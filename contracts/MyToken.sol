// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken
 * @dev ERC20 Token with burn capability and ownership
 * @notice This is a simple token for learning purposes
 */
contract MyToken is ERC20, ERC20Burnable, Ownable {
    // Maximum supply cap
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1 million tokens
    
    /**
     * @dev Constructor mints initial supply to deployer
     * @param initialSupply Initial amount of tokens to mint
     */
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") Ownable(msg.sender) {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds maximum");
        _mint(msg.sender, initialSupply);
    }
    
    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to receive tokens
     * @param amount Amount of tokens to mint
     */
    /**
     * @notice Mints new tokens to specified address
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Get remaining mintable supply
     * @return Amount of tokens that can still be minted
     */
    function remainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
}