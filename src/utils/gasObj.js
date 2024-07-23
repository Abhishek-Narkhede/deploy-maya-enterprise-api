const hre = require("hardhat");
module.exports = {
    getLatestGas: async () => {
        const latestBlock = await hre.ethers.provider.getBlock("latest");
        if (!latestBlock?.gasUsed) {
            return {
                gasPrice: hre.ethers.utils.parseUnits("10", "gwei"),
                gasLimit: 7920027
            }
        }
        const gasUsed = await convertToWei(latestBlock.gasUsed)
        // const gasLimit = await convertToWei(latestBlock.gasLimit)
        return { gasPrice: gasUsed }
    },
   
}
async function convertToWei(bigNumber) {
    // Convert big number to ethers BigNumber
    const bigNumberWei = hre.ethers.BigNumber.from(bigNumber); // 1 Ether in Wei
    let spliceNum = bigNumberWei?.toString()?.slice(0,2)
    // Convert Wei to Gwei
    const bigNumberGwei = hre.ethers.utils.parseUnits(spliceNum, "gwei");
    return bigNumberGwei;
  }