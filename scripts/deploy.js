/**
 * Deployment script for MyToken contract
 * Run: npx hardhat run scripts/deploy.js --network baseSepolia
 */

const hre = require("hardhat");

async function main() {
  try {
    console.log(`Starting MyToken deployment on ${hre.network.name} network...`);

    // Check if private key is configured
    if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
      throw new Error("PRIVATE_KEY not configured in .env file");
    }

    // Get the contract factory
    const MyToken = await hre.ethers.getContractFactory("MyToken");
    
    // Initial supply: 100,000 tokens (with 18 decimals)
    const initialSupply = hre.ethers.parseEther("100000");
    
    console.log("Deploying MyToken with initial supply:", hre.ethers.formatEther(initialSupply));
    
    // Deploy the contract
    const myToken = await MyToken.deploy(initialSupply);
    
    await myToken.waitForDeployment();
    
    const address = await myToken.getAddress();
  
  console.log(`\n✅ MyToken deployed to: ${address} on ${hre.network.name}`);
  console.log("📊 Initial supply:", hre.ethers.formatEther(initialSupply), "MTK");
  
  try {
    console.log("🏭 Max supply:", hre.ethers.formatEther(await myToken.MAX_SUPPLY()), "MTK");
  } catch (error) {
    console.log("🏭 Max supply: Bilgi alınamadı");
  }
  
  try {
    console.log("👤 Owner:", await myToken.owner());
  } catch (error) {
    console.log("👤 Owner: Bilgi alınamadı");
  }
  
  try {
    console.log("🔄 Staking reward rate:", (await myToken.rewardRate()).toString(), "% per year");
  } catch (error) {
    console.log("🔄 Staking reward rate: Bilgi alınamadı");
  }
  
  try {
    console.log("💰 Total staked:", hre.ethers.formatEther(await myToken.totalStaked()), "MTK");
  } catch (error) {
    console.log("💰 Total staked: Bilgi alınamadı");
  }
  
  // Base Explorer URLs
  const explorerURLs = {
    baseMainnet: `https://basescan.org/address/${address}`,
    baseGoerli: `https://goerli.basescan.org/address/${address}`,
    baseSepolia: `https://sepolia.basescan.org/address/${address}`
  };
  
  if (explorerURLs[hre.network.name]) {
    console.log(`\n🔍 View on Base Explorer: ${explorerURLs[hre.network.name]}`);
  }
  
  // Verify contract on explorer (if not local network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    
    // Base networks may need more confirmations
    const confirmations = hre.network.name.includes("base") ? 10 : 6;
    await myToken.deploymentTransaction().wait(confirmations);
    
    // Check if API key is configured for verification
    if (!process.env.BASESCAN_API_KEY && hre.network.name.includes("base")) {
      console.log("⚠️ BASESCAN_API_KEY not configured in .env file. Contract verification skipped.");
    } else {
      console.log("📝 Verifying contract on explorer...");
      try {
        await hre.run("verify:verify", {
          address: address,
          constructorArguments: [initialSupply],
        });
        console.log("✅ Contract verified!");
      } catch (error) {
        console.log("⚠️ Verification failed:", error.message);
      }
    }
  }
  
  console.log("\n🎉 Deployment completed successfully!");
  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error.message);
    
    // Provide helpful error messages for common issues
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Suggestion: You need to fund your wallet with testnet ETH.");
      console.log("   For Base Sepolia, visit: https://www.coinbase.com/faucets/base-sepolia-faucet");
    } else if (error.message.includes("nonce")) {
      console.log("\n💡 Suggestion: Nonce issue detected. Try resetting your account in MetaMask.");
    } else if (error.message.includes("gas")) {
      console.log("\n💡 Suggestion: Try increasing the gas limit in hardhat.config.js.");
    }
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Unexpected error:", error);
    process.exit(1);
  });