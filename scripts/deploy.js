const dotenv = require("dotenv");
const path = require("path");
// const fs = require("fs-extra");
const hre = require("hardhat");
// const ethers =  require("ethers");
// var shell = require("shelljs");

// let web3 = require("web3");
let ContractUtils = require("./contractUtils");
const contractABI = require("../src/_blockchain/contractABI");
// let Events = require("c:/Users/prafu/Downloads/utility-art-api/scripts/events");

dotenv.config({ path: path.join(__dirname, "../.env") });

let owner = process.env.PRIVATE_KEY_ADDRESS;


let deployArtyfactNFTContract = async (factoryAddr) => {
  let res = await ContractUtils.deployNFTContractMarketplace({
    c: 500,
    feeRecipient: process.env.PRIVATE_KEY_ADDRESS,
    factoryAddr: factoryAddr,
    verify: true,
  });
  console.log("Marketplace Contract Address: ", res.address);
  return res.address;
};


const deploy = async (collectionDataNew) => {
  const CONTRACT_NAME = "ArtyfactNFT"
  const _priceInBNB = hre.ethers.utils.parseUnits((collectionDataNew.priceObj.find(i=>i.name == "bnb").price).toString(),"18");
  const _priceInArty = hre.ethers.utils.parseUnits((collectionDataNew.priceObj.find(i=>i.name == "arty").price).toString(),"6");
  const _priceInUSDT = hre.ethers.utils.parseUnits((collectionDataNew.priceObj.find(i=>i.name == "usdt").price).toString(),"18");
  const _priceInBUSD = hre.ethers.utils.parseUnits((collectionDataNew.priceObj.find(i=>i.name == "busd").price).toString(),"18");
  const _priceInUSDC = hre.ethers.utils.parseUnits((collectionDataNew.priceObj.find(i=>i.name == "usdc").price).toString(),"18");
  const _treasuryWallet = collectionDataNew.treasuryWallet;
  const _companyWallet = collectionDataNew.companyWallet;
  const URI = `ipfs.io/ipfs/`
  let _args = [collectionDataNew.name, collectionDataNew.tokenTracker,
  collectionDataNew.totalSupply,
    URI,
    _priceInBNB,
    _priceInArty,
    _priceInUSDT,
    _priceInBUSD,
    _priceInUSDC,
    _treasuryWallet,
    _companyWallet
  ]
  console.log("Compile Marketplace Contract now... ",..._args);
  await hre.run("compile");
  console.log("Compile Marketplace Contract Done ✓ ");
  console.log("Deploying Marketplace Contract now");
  const UtilityArtMarketplace = await hre.ethers.getContractFactory(CONTRACT_NAME);
  const ArtyMarketplaceDeployedContract = await UtilityArtMarketplace.deploy(..._args);
  console.log("Deployed Contract , waiting for confirmation...",);
  await ArtyMarketplaceDeployedContract.deployed();
  try {
    await hre.run("verify:verify", {
      address: ArtyMarketplaceDeployedContract.address,
      constructorArguments: _args,
    });
  } catch (error) {
    console.log("verify error :: ", error.message);
  }


}
// deploy({
//   "_id": "64d1f79db2cadd41f07150b4",
//   "category": "avatar",
//   "price": 20,
//   "totalSupply": 22,
//   "isVisible": false,
//   "isApproved": false,
//   "galleryImages": [

//   ],
//   "is3D": false,
//   "progressStatus": 0,
//   "mint": 0,
//   "isArtyPrice": false,
//   "priceObj": [
//     {
//       "name": "usdt",
//       "isAvailable": false,
//       "price": 20
//     },
//     {
//       "name": "arty",
//       "isAvailable": false,
//       "price": 15
//     },
//     {
//       "name": "usdc",
//       "isAvailable": true,
//       "price": 10
//     },
//     {
//       "name": "busd",
//       "isAvailable": true,
//       "price": 10
//     },
//     {
//       "name": "bnb",
//       "isAvailable": true,
//       "price": 1
//     }
//   ],
//   "active": true,
//   "name": "Vitalik Buterin Collection",
//   "intro": "Description of collection",
//   "tokenTracker": "COLLE",
//   "rarity": "Bronze",
//   "launchDate": "2023-08-08T00:00:00.000+0000",
//   "seriesId": "648bfe62428bba3fc880606d",
//   "assetImage": "https://artyfactassests.s3.ap-south-1.amazonaws.com/uploads/1691481986535/avatar1.png",
//   "coverImage": "https://artyfactassests.s3.ap-south-1.amazonaws.com/uploads/1691481998717/avatar7.png",
//   "asset3dFile": "https://artyfactassests.s3.ap-south-1.amazonaws.com/uploads/collection_animation_url.glb",
//   "animationFileExtension": "",
//   "createdAt": "2023-08-08T08:06:53.201+0000",
//   "updatedAt": "2023-08-08T09:22:50.796+0000",
//   "__v": 0,
//   "animationFileName": "",
//   "companyWallet": "0xaA0d8Af1065eB6e4493dC0883a865f3cea5929cC",
//   "treasuryWallet": "0xaA0d8Af1065eB6e4493dC0883a865f3cea5929cC"
// })


const ADMIN_WALLET = '0x0A70c7294f9Deffe389E437347ba1B6De531D16C'
const USDT_CONTRACT_ADDRESS = '0x1545D21Af5d240EA25c5e1Ad66b5acdc4DeE802D'
const BUSD_CONTRACT_ADDRESS = '0x5B1D52Cf88053C14B153Ba8Ea0152d093e1E3188'
const USDC_CONTRACT_ADDRESS = '0xab75256Ff788c213B1614E6f1eA34b4523d4cf52'
const ARTY_CONTRACT_ADDRESS = '0xF9915c4d4c2E63cA01336bfc66C74AA22C95Bb21'
const RPCURL = "https://data-seed-prebsc-1-s1.binance.org:8545/"//"https://bsc-dataseed1.binance.org"

const contractAddr = '0xfB63C56962E42e02F77f4B554c82AEcA46A28b54';
const userPrivateKey = '0x6048ac1dc6e678d2007c43e983a0104525cc205fc728585f772b901a2b69df2c'
const userAddress = '0xae6ea2994e82bfb9dc8f774ed51e036da4ad2436'

const initiatePaymentOfToken = async ({ editionId, transactionId, currency, userPrivateKey, userAddress, price }) => {
  const privateKey = userPrivateKey; // Replace with the private key of the sender's wallet
  const fromAddress = userAddress; // Replace with the sender's wallet address
  const toAddress = ADMIN_WALLET; // Replace with the recipient's wallet address
  // Connect to the BSC network
  let currDec = {
    'arty': 6,
    'usdt': 18,
    'bnb': 18,
    'busd': 18
  }
  const provider = new hre.ethers.providers.JsonRpcProvider(RPCURL);
  const wallet = new hre.ethers.Wallet(privateKey, provider);
  const amount = hre.ethers.utils.parseUnits(price.toString(), currDec[currency]); // Replace with the amount of BNB to send
  try {
    if (currency == 'usdt') {
      console.log("usdt sending!");

      const usdtAddress = USDT_CONTRACT_ADDRESS; // Replace with the USDT token contract address
      const usdtAbi = ["function transfer(address to, uint256 amount) returns (bool)"];

      // Create a contract instance for USDT
      const usdtContract = new hre.ethers.Contract(usdtAddress, usdtAbi, wallet);

      // Deduct the amount from the wallet
      const tx = await usdtContract.transfer(toAddress, amount, {
        nonce: undefined
      });
      const wRes = await tx.wait();
      // console.log("usdt tx ===>", tx);
      console.log("Transaction Hash:", tx.hash);
      console.log("wRes", wRes);

    } else if (currency == 'bnb') {
      console.log("BNB sending!");

      // Create a transaction object
      const transaction = {
        to: toAddress,
        value: amount,
      };
      // Send the transaction
      const btx = await wallet.sendTransaction(transaction);
      const wRes = await btx.wait();
      console.log("btx ===>", btx);
      console.log("Transaction Hash:", btx.hash);
      console.log("wRes", wRes);
      // transfer
    } else if (currency == 'arty') {
      console.log("Arty sending!");
      const artyAddress = ARTY_CONTRACT_ADDRESS;
      const artyAbi = ["function transfer(address recipient, uint256 amount) external returns (bool)"];

      // Create a contract instance for USDT
      const artyContract = new hre.ethers.Contract(artyAddress, artyAbi, wallet);

      // Deduct the amount from the wallet
      const tx = await artyContract.transfer('0x1ebE0506DeDCa92370Ec3ae0cE6642F12C28Ca42', amount, {
        nonce: undefined,
        gas
      });
      const wRes = await tx.wait();
      console.log("Transaction Hash:", tx.hash);
      console.log("wRes", wRes);
      console.log("ARTY sent successfully!");
      console.log("From:", fromAddress);
      console.log("To:", '0x1ebE0506DeDCa92370Ec3ae0cE6642F12C28Ca42');
      console.log("Amount:", hre.ethers.utils.formatUnits(amount, currDec[currency]));
    }
  } catch (error) {
    console.log("error", error.message);
  }



}
// initiatePaymentOfToken({
//   editionId: '',
//   transactionId: '',
//   currency: 'arty',
//   userPrivateKey: '0x6048ac1dc6e678d2007c43e983a0104525cc205fc728585f772b901a2b69df2c',
//   userAddress: '0xae6ea2994e82bfb9dc8f774ed51e036da4ad2436',
//   price: 50
// })

async function verifyTransaction(transactionHash) {
  const provider = new hre.ethers.providers.JsonRpcProvider(RPCURL); // Replace with your desired provider URL

  try {
    const transactionReceipt = await provider.getTransactionReceipt(transactionHash);
    console.log(transactionReceipt);
    if (transactionReceipt && transactionReceipt.status === 1) {
      console.log("Transaction is confirmed!");
      console.log("Block number:", transactionReceipt.blockNumber);
    } else {
      console.log("Transaction is still pending or not found.");
    }
  } catch (error) {
    console.log("Error occurred:", error.message);
  }
}
const secondaryInternal = async () => {
  const sellerAddr = '0xAE6Ea2994e82BfB9DC8f774ED51E036dA4Ad2436'
  const sellerAddrPk = '0x6048ac1dc6e678d2007c43e983a0104525cc205fc728585f772b901a2b69df2c'
  const NFT_CONTRACT_ADDR = "0x9e399b67002c8e3038CbC0Ba1bf944090D5A109f"
  const buyerAddr = "0x0A70c7294f9Deffe389E437347ba1B6De531D16C"
  const ABI = contractABI

  const provider = new hre.ethers.providers.JsonRpcProvider(RPCURL);
  const sellerWallet = new hre.ethers.Wallet(sellerAddrPk, provider);

  const contract = new hre.ethers.Contract(NFT_CONTRACT_ADDR, ABI, sellerWallet);

  const ArtNFTDeployedContract1 = await contract.transferFrom(sellerAddr, buyerAddr, 1, {
    gasPrice: hre.ethers.utils.parseUnits("20", "gwei"),
    gasLimit: 7920027
  })
  console.log("reciept", ArtNFTDeployedContract1);
}
async function getLogs() {
  const transactionHash = "0x48175985a591163612e5fd6a70923115453cc9a33a0a5ec76b628340323dafd4"; // Replace with the transaction hash you want to get logs from

  // Get the transaction receipt
  const receipt = await hre.ethers.provider.getTransactionReceipt(transactionHash);
  // let events = receipt.events;

  console.log("events", receipt);

  let tokenIdArr = [];
  // const parsedLogs = receipt.logs.map((log) => {
  //   return contractInterface.parseLog(log);
  // });
  for (let i = 0; i < receipt.logs.length; i++) {
    const aEvent = receipt.logs[i];
    if (aEvent.event == "Transfer") {
      console.log("Args : ", aEvent.args.tokenId.toNumber());
      tokenIdArr.push(aEvent.args.tokenId.toNumber());
    }
  }
  console.log("tokenIdArr", tokenIdArr);
}
async function getEventsFromTransactionHash() {
  try {
    const transactionHash = "0x48175985a591163612e5fd6a70923115453cc9a33a0a5ec76b628340323dafd4"; // Replace with the transaction hash you want to get logs from

    const provider = new hre.ethers.providers.JsonRpcProvider(process.env.RPCURL); // Replace with your own provider URL if not using the default one
    const receipt = await provider.getTransactionReceipt(transactionHash);

    if (!receipt || !receipt.logs || receipt.logs.length === 0) {
      console.log("No logs found for the transaction.");
      return;
    }

    const contractInterface = new hre.ethers.utils.Interface(contractABI); // Replace 'contractAbi' with the ABI of the contract emitting the events

    const parsedLogs = receipt.logs.map((log) => {
      return contractInterface.parseLog(log);
    });
    let tokenIdArr = []
    for (let i = 0; i < parsedLogs.length; i++) {
      const aEvent = parsedLogs[i];
      if (aEvent.name == "Transfer") {
        // console.log("Args : ", aEvent.args[0].tokenId);
        tokenIdArr.push(aEvent.args.tokenId.toNumber());
      }
    }
    console.log("Events from the transaction:", tokenIdArr);
    console.log(parsedLogs);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}
async function fetchGasFees() {
  const provider = new hre.ethers.providers.JsonRpcProvider(RPCURL);
  const gasPrice = await provider.getFeeData();

  console.log("Current Gas Price (Gwei):", gasPrice, hre.ethers.utils.parseUnits(gasPrice.maxPriorityFeePerGas.toString(), "gwei"));
}

async function fetchGasFeesoflatestblk() {
  const provider = new hre.ethers.providers.JsonRpcProvider(RPCURL);
  const latestBlock = await provider.getBlock("latest");
  console.log("latestBlock ::", latestBlock);

  if (latestBlock && latestBlock.gasUsed) {
    // const gasFee = latestBlock.gasUsed.mul(latestBlock.baseFeePerGas);
    console.log("Latest Block Gas Fee (Gwei):", hre.ethers.utils.parseUnits(latestBlock.gasUsed.toString(), "gwei"));
  } else {
    console.log("Failed to retrieve the latest block's gas fee.");
  }

}
// fetchGasFeesoflatestblk()
