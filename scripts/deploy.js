/**
 * Deployment script for MyToken contract
 * Run: npx hardhat run scripts/deploy.js --network baseSepolia
 */

const hre = require("hardhat");

async function main() {
  console.log(`Starting MyToken deployment on ${hre.network.name} network...`);

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