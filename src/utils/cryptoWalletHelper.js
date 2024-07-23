const multiChainWallet = require('multichain-crypto-wallet');


const createWalletAndGetData = async (orgDetails) => {
  /* Create Wallet */
  try {
    const wallet = await multiChainWallet.createWallet({
      network: 'ethereum',
    });

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic
    }

  } catch (error) {
    console.error("Create Wallet Account ::", orgDetails, error);
    return {
      address: '',
      privateKey: '',
      mnemonic: ''
    }
  }
}

const retriveWalletFromMnemonics = async (seedPhrase) => {
  // Generate an Ethereum wallet from mnemonic.
  try {
    const wallet = await multiChainWallet.generateWalletFromMnemonic({
      mnemonic:seedPhrase,//'diesel ill endorse student into where cave insane giggle seed village pulp',
      // derivationPath: "m/44'/60'/0'/0/0", // Leave empty to use default derivation path
      network: 'ethereum',
    }); // NOTE - Address generated will work for EVM compatible blockchains E.g. Binance smart chain, Polygon etc
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic
    }
  } catch (error) {
    console.error("retriveWalletFromMnemonics Wallet Account ::", orgDetails, error);
    return {errMsg:error.message}
    return {
      address: '',
      privateKey: '',
      mnemonic: ''
    }
  }
}

const getBalance = async (address) => {
  try {
    const data = await multiChainWallet.getBalance({
      address: address,
      network: 'ethereum',
      rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
    })
    return data
  } catch (error) {
    return 0
  }
}
module.exports = {
  createWalletAndGetData,
  retriveWalletFromMnemonics,
  getBalance
}
