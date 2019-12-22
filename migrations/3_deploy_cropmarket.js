const CropMarket = artifacts.require("CropMarket");

module.exports = function(deployer) {
    deployer.deploy(CropMarket);
}