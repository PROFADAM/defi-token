// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MyToken
 * @dev ERC20 Token with burn capability, ownership and staking functionality
 * @notice This is a DeFi token with staking rewards
 */
contract MyToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    // Maximum supply cap
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1 million tokens
    
    // Staking variables
    uint256 public rewardRate = 10; // 10% annual reward rate
    uint256 public constant REWARD_INTERVAL = 365 days; // Annual rewards
    
    // Staking data structure
    struct StakeInfo {
        uint256 amount;
        uint256 since;
        uint256 claimedRewards;
    }
    
    // Mapping of staker address to their staking info
    mapping(address => StakeInfo) public stakes;
    
    // Total staked amount
    uint256 public totalStaked;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    
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
    
    /**
     * @notice Stake tokens to earn rewards
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Calculate rewards if already staking
        uint256 reward = 0;
        if (stakes[msg.sender].amount > 0) {
            reward = calculateReward(msg.sender);
        } else {
            // Initialize stake record if first time staking
            stakes[msg.sender].since = block.timestamp;
        }
        
        // Update state variables (CEI pattern)
        if (reward > 0) {
            stakes[msg.sender].claimedRewards += reward;
        }
        
        // Update stake amount
        stakes[msg.sender].amount += amount;
        totalStaked += amount;
        
        // External interactions after state changes
        if (reward > 0) {
            _mint(msg.sender, reward);
        }
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @notice Unstake tokens and claim rewards
     * @param amount Amount of tokens to unstake
     */
    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot unstake 0 tokens");
        require(stakes[msg.sender].amount >= amount, "Insufficient staked amount");
        
        // Calculate rewards
        uint256 reward = calculateReward(msg.sender);
        
        // Update staking data - CEI (Checks-Effects-Interactions) pattern
        stakes[msg.sender].amount -= amount;
        totalStaked -= amount;
        
        // Reset staking timestamp if fully unstaked
        if (stakes[msg.sender].amount == 0) {
            stakes[msg.sender].since = 0;
        } else {
            stakes[msg.sender].since = block.timestamp;
        }
        
        // Update claimed rewards
        if (reward > 0) {
            stakes[msg.sender].claimedRewards += reward;
        }
        
        // External interactions after state changes (CEI pattern)
        if (reward > 0) {
            _mint(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
        
        // Return staked tokens
        _transfer(address(this), msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @notice Claim staking rewards without unstaking
     */
    function claimRewards() external nonReentrant {
        StakeInfo storage stakeInfo = stakes[msg.sender];
        require(stakeInfo.amount > 0, "No staked tokens");
        
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No rewards to claim");
        
        // Update state variables first (CEI pattern)
        stakeInfo.since = block.timestamp;
        stakeInfo.claimedRewards += reward;
        
        // External interaction after state changes
        _mint(msg.sender, reward);
        
        emit RewardPaid(msg.sender, reward);
    }
    
    /**
     * @notice Calculate pending rewards for a staker
     * @param staker Address of the staker
     * @return Pending reward amount
     */
    function calculateReward(address staker) public view returns (uint256) {
        StakeInfo storage stakeInfo = stakes[staker];
        
        // Early return to save gas
        if (stakeInfo.amount == 0) {
            return 0;
        }
        
        uint256 stakingDuration = block.timestamp - stakeInfo.since;
        
        // Optimize calculation to reduce gas usage
        return (stakeInfo.amount * rewardRate * stakingDuration) / (REWARD_INTERVAL * 100);
    }
    
    /**
     * @notice Get staking information for an address
     * @param staker Address to query
     * @return Staked amount, staking timestamp, and claimed rewards
     */
    function getStakeInfo(address staker) external view returns (uint256, uint256, uint256) {
        return (
            stakes[staker].amount,
            stakes[staker].since,
            stakes[staker].claimedRewards
        );
    }
    
    /**
     * @notice Update reward rate (only owner)
     * @param newRate New annual reward rate percentage
     */
    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 100, "Rate cannot exceed 100%");
        rewardRate = newRate;
    }
}