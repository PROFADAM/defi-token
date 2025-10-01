const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken Contract", function () {
  let myToken;
  let owner;
  let addr1;
  let addr2;
  const INITIAL_SUPPLY = ethers.parseEther("100000");
  const MAX_SUPPLY = ethers.parseEther("1000000");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy(INITIAL_SUPPLY);
    await myToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await myToken.owner()).to.equal(owner.address);
    });

    it("Should assign the initial supply to the owner", async function () {
      const ownerBalance = await myToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should have correct name and symbol", async function () {
      expect(await myToken.name()).to.equal("MyToken");
      expect(await myToken.symbol()).to.equal("MTK");
    });

    it("Should have correct max supply", async function () {
      expect(await myToken.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const amount = ethers.parseEther("100");
      await myToken.transfer(addr1.address, amount);
      expect(await myToken.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await myToken.balanceOf(owner.address);
      await expect(
        myToken.connect(addr1).transfer(owner.address, ethers.parseEther("1"))
      ).to.be.reverted;
      expect(await myToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const amount = ethers.parseEther("100");
      await myToken.transfer(addr1.address, amount);
      await myToken.transfer(addr2.address, ethers.parseEther("50"));
      
      expect(await myToken.balanceOf(addr1.address)).to.equal(amount);
      expect(await myToken.balanceOf(addr2.address)).to.equal(ethers.parseEther("50"));
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await myToken.mint(addr1.address, mintAmount);
      expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should fail if non-owner tries to mint", async function () {
      await expect(
        myToken.connect(addr1).mint(addr1.address, ethers.parseEther("1000"))
      ).to.be.reverted;
    });

    it("Should not allow minting beyond max supply", async function () {
      const overMaxAmount = MAX_SUPPLY;
      await expect(myToken.mint(addr1.address, overMaxAmount)).to.be.revertedWith(
        "Would exceed max supply"
      );
    });

    it("Should correctly calculate remaining supply", async function () {
      const remaining = await myToken.remainingSupply();
      expect(remaining).to.equal(MAX_SUPPLY - INITIAL_SUPPLY);
    });
  });

  describe("Burning", function () {
    it("Should allow token holders to burn their tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      await myToken.burn(burnAmount);
      expect(await myToken.balanceOf(owner.address)).to.equal(
        INITIAL_SUPPLY - burnAmount
      );
    });

    it("Should reduce total supply when burning", async function () {
      const burnAmount = ethers.parseEther("100");
      await myToken.burn(burnAmount);
      expect(await myToken.totalSupply()).to.equal(INITIAL_SUPPLY - burnAmount);
    });

    it("Should fail when burning more than balance", async function () {
      await expect(myToken.burn(INITIAL_SUPPLY + ethers.parseEther("1"))).to.be
        .reverted;
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      await myToken.transferOwnership(addr1.address);
      expect(await myToken.owner()).to.equal(addr1.address);
    });

    it("Should prevent non-owners from transferring ownership", async function () {
      await expect(
        myToken.connect(addr1).transferOwnership(addr2.address)
      ).to.be.reverted;
    });
  });
});