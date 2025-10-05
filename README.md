# 🚀 DeFi Token Project

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)
![Hardhat](https://img.shields.io/badge/Hardhat-Framework-yellow)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-Contracts-orange)
![License](https://img.shields.io/badge/license-MIT-green)
![Base](https://img.shields.io/badge/Base-Network-blue)

**MyToken (MTK)** - Gelişmiş DeFi özellikleri ile donatılmış, güvenli ve gas-optimized ERC20 token implementasyonu.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Hızlı Başlangıç](#-hızlı-başlangıç)
- [Kurulum](#-kurulum)
- [Deployment](#-deployment)
- [Staking Sistemi](#-staking-sistemi)
- [Güvenlik](#-güvenlik)
- [API Referansı](#-api-referansı)
- [Test](#-test)
- [Katkıda Bulunma](#-katkıda-bulunma)

## ✨ Özellikler

### 🔥 Temel Özellikler
- ✅ **ERC20 Standardı**: Tam uyumlu ERC20 token implementasyonu
- ✅ **Minting**: Sadece owner tarafından yeni token basımı
- ✅ **Burning**: Token sahipleri kendi tokenlarını yakabilir
- ✅ **Max Supply**: 1,000,000 MTK maksimum arz limiti
- ✅ **Ownership**: Güvenli sahiplik yönetimi

### 💰 Staking Sistemi
- 🎯 **Flexible Staking**: İstediğiniz miktarda token stake edin
- 📈 **Annual Rewards**: %10 yıllık ödül oranı (ayarlanabilir)
- ⚡ **Instant Claiming**: Ödüllerinizi anında talep edin
- 🔄 **Partial Unstaking**: Kısmi unstaking desteği
- 📊 **Real-time Tracking**: Anlık ödül hesaplama

### 🛡️ Güvenlik Özellikleri
- 🔒 **Reentrancy Protection**: ReentrancyGuard ile korunma
- ⚖️ **CEI Pattern**: Checks-Effects-Interactions güvenlik deseni
- 🔐 **Access Control**: OpenZeppelin Ownable implementasyonu
- ⛽ **Gas Optimized**: Optimize edilmiş gas kullanımı

## 🚀 Hızlı Başlangıç

```bash
# Repository'yi klonlayın
git clone https://github.com/PROFADAM/defi-token.git
cd defi-token

# Bağımlılıkları yükleyin
npm install

# Testleri çalıştırın
npm test

# Kontratı derleyin
npm run compile

# Base Sepolia'ya deploy edin
npm run deploy:base-sepolia
```

## 📦 Kurulum

### Gereksinimler
- **Node.js** >= 18.0.0
- **npm** veya **yarn**
- **Git**

### Adım Adım Kurulum

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/PROFADAM/defi-token.git
cd defi-token
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Ortam değişkenlerini ayarlayın:**
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
```

4. **Kontratları derleyin:**
```bash
npx hardhat compile
```

## 🌐 Deployment

### Base Sepolia Testnet'e Deploy

1. **Base Sepolia ETH edinin:**
   - [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-sepolia-faucet) adresinden test ETH alın

2. **Deploy komutunu çalıştırın:**
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

3. **Kontratı doğrulayın:**
```bash
npx hardhat verify --network baseSepolia CONTRACT_ADDRESS INITIAL_SUPPLY
```

### Desteklenen Ağlar

| Ağ | Chain ID | RPC URL |
|-----|----------|---------|
| Base Mainnet | 8453 | https://mainnet.base.org |
| Base Sepolia | 84532 | https://sepolia.base.org |
| Base Goerli | 84531 | https://goerli.base.org |

## 💎 Staking Sistemi

### Staking Nasıl Çalışır?

1. **Token Stake Etme**: Tokenlarınızı stake ederek ödül kazanmaya başlayın
2. **Ödül Hesaplama**: Ödüller saniye bazında hesaplanır
3. **Ödül Talep Etme**: İstediğiniz zaman ödüllerinizi talep edebilirsiniz
4. **Unstaking**: Kısmi veya tam unstaking yapabilirsiniz

### Kullanım Örnekleri

```javascript
// Kontrata bağlanma
const myToken = await ethers.getContractAt("MyToken", contractAddress);

// 1000 MTK stake etme
await myToken.stake(ethers.parseEther("1000"));

// Staking bilgilerini görüntüleme
const [stakedAmount, stakingSince, claimedRewards] = await myToken.getStakeInfo(userAddress);
console.log(`Staked: ${ethers.formatEther(stakedAmount)} MTK`);

// Bekleyen ödülleri kontrol etme
const pendingRewards = await myToken.calculateReward(userAddress);
console.log(`Pending Rewards: ${ethers.formatEther(pendingRewards)} MTK`);

// Ödülleri talep etme
await myToken.claimRewards();

// 500 MTK unstake etme
await myToken.unstake(ethers.parseEther("500"));
```

### Ödül Hesaplama Formülü

```
Ödül = (Staked Amount × Reward Rate × Staking Duration) / (365 days × 100)
```

## 🛡️ Güvenlik

### Güvenlik Denetimleri

- ✅ **Reentrancy Koruması**: Tüm fonksiyonlarda ReentrancyGuard
- ✅ **CEI Pattern**: Güvenli state değişiklik sıralaması
- ✅ **Access Control**: Kritik fonksiyonlar için yetki kontrolü
- ✅ **Integer Overflow**: Solidity 0.8.20 built-in koruması
- ✅ **Gas Optimization**: Optimize edilmiş storage erişimi

### Bilinen Güvenlik Özellikleri

1. **Reentrancy Protection**: `nonReentrant` modifier ile korunma
2. **CEI Pattern**: Checks-Effects-Interactions sıralaması
3. **Safe Math**: Solidity 0.8+ otomatik overflow koruması
4. **Access Control**: OpenZeppelin Ownable implementasyonu

### Güvenlik En İyi Uygulamaları

- Private key'leri asla kodda saklamayın
- `.env` dosyasını `.gitignore`'a ekleyin
- Mainnet'e deploy etmeden önce testnet'te test edin
- Kontrat adreslerini doğrulayın

## 📚 API Referansı

### Temel ERC20 Fonksiyonları

```solidity
function transfer(address to, uint256 amount) external returns (bool)
function approve(address spender, uint256 amount) external returns (bool)
function transferFrom(address from, address to, uint256 amount) external returns (bool)
function balanceOf(address account) external view returns (uint256)
function totalSupply() external view returns (uint256)
```

### Staking Fonksiyonları

```solidity
function stake(uint256 amount) external
function unstake(uint256 amount) external
function claimRewards() external
function calculateReward(address staker) external view returns (uint256)
function getStakeInfo(address staker) external view returns (uint256, uint256, uint256)
```

### Owner Fonksiyonları

```solidity
function mint(address to, uint256 amount) external onlyOwner
function setRewardRate(uint256 newRate) external onlyOwner
function transferOwnership(address newOwner) external onlyOwner
```

## 🧪 Test

### Test Çalıştırma

```bash
# Tüm testleri çalıştır
npm test

# Belirli bir test dosyasını çalıştır
npx hardhat test test/MyToken.test.js

# Gas raporu ile test çalıştır
REPORT_GAS=true npm test

# Coverage raporu
npm run coverage
```

### Test Kapsamı

- ✅ ERC20 temel fonksiyonları
- ✅ Minting ve burning işlemleri
- ✅ Staking mekanizması
- ✅ Ödül hesaplama
- ✅ Access control
- ✅ Edge case'ler

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Lütfen aşağıdaki adımları takip edin:

1. **Fork** edin
2. **Feature branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. **Commit** edin (`git commit -m 'Add amazing feature'`)
4. **Push** edin (`git push origin feature/amazing-feature`)
5. **Pull Request** açın

### Geliştirme Kuralları

- Kod değişikliklerinden önce testler yazın
- Commit mesajlarını açıklayıcı yazın
- Code style'a uygun kod yazın
- Dokümantasyonu güncel tutun

## 📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

## 📞 İletişim

- **GitHub**: [PROFADAM](https://github.com/PROFADAM)
- **Issues**: [GitHub Issues](https://github.com/PROFADAM/defi-token/issues)

## 🗺️ Roadmap

- [x] ✅ Temel ERC20 implementasyonu
- [x] ✅ Minting ve burning özellikleri
- [x] ✅ Staking mekanizması
- [x] ✅ Base network desteği
- [x] ✅ Güvenlik optimizasyonları
- [ ] 🔄 Governance özellikleri
- [ ] 🔄 Multi-signature desteği
- [ ] 🔄 Cross-chain bridge
- [ ] 🔄 NFT staking desteği

## ❓ Sık Sorulan Sorular

**S: Maksimum kaç token basılabilir?**
C: Maksimum 1,000,000 MTK token basılabilir.

**S: Staking ödülleri nereden geliyor?**
C: Ödüller yeni basılan tokenlardan karşılanır ve max supply limitine tabidir.

**S: Minimum staking süresi var mı?**
C: Hayır, istediğiniz zaman unstake edebilirsiniz.

**S: Ödül oranı değişebilir mi?**
C: Evet, kontrat sahibi ödül oranını güncelleyebilir (maksimum %100).

**S: Gas ücretleri ne kadar?**
C: Base network'ün düşük gas ücretleri sayesinde işlemler çok ekonomiktir.

---

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**