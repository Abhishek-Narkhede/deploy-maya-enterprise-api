
function convertToJSON(str) {
    var str1 = str.replace(/[{}]/g, '');
    var properties = str1.split(',');
    var obj = {};
    properties.forEach(function (property) {
        var tup = property.split(':');
        obj[tup[0]] = tup[1];
    });
    return obj;
}
const WeiToNumberForTokenAddress = (t, decimal = 18) => t / (10 ** decimal)
const convertToWei = (t, decimal = 18) => {
    // let tt =  ethers.BigNumber.from(t);
    // tt =tt.toString()
    // console.log("DECIMAL ",+tt,decimal,+tt * (10 ** decimal));
    return t * (10 ** decimal)
}
module.exports = {
    convertToJSON,
    WeiToNumberForTokenAddress,
    convertToWei
}