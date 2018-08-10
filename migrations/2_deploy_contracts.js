var SelfSovereignIdentity = artifacts.require("./SelfSovereignIdentity.sol");


module.exports = function(deployer) {
  deployer.deploy(SelfSovereignIdentity);

};
