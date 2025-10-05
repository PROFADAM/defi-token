/**
 * Deployment script for MyToken contract
 * Run: npx hardhat run scripts/deploy.js
 */

const hre = require("hardhat");

async function main() {
  console.log("Starting MyToken deployment...");

  // Get the contract factory
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  
  // Initial supply: 100,000 tokens (with 18 decimals)
  const initialSupply = hre.ethers.parseEther("100000");
  
  console.log("Deploying MyToken with initial supply:", hre.ethers.formatEther(initialSupply));
  
  // Deploy the contract
  const myToken = await MyToken.deploy(initialSupply);
  
  await myToken.waitForDeployment();
  
  const address = await myToken.getAddress();
  
  console.log("✅ MyToken deployed to:", address);
  console.log("📊 Initial supply:", hre.ethers.formatEther(initialSupply), "MTK");
  console.log("🏭 Max supply:", hre.ethers.formatEther(await myToken.MAX_SUPPLY()), "MTK");
  console.log("👤 Owner:", await myToken.owner());
  console.log("🔄 Staking reward rate:", (await myToken.rewardRate()).toString(), "% per year");
  console.log("💰 Total staked:", hre.ethers.formatEther(await myToken.totalStaked()), "MTK");
  
  // Verify contract on explorer (if not local network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await myToken.deploymentTransaction().wait(6);
    
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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });