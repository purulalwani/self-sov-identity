// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import identity_artifacts from '../../build/contracts/SelfSovereignIdentity.json'

// Identity is our usable abstraction, which we'll use through the code below.
var Identity = contract(identity_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the Identity abstraction for Use.
    Identity.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      for(var i=0; i<3; i++){
        var ownerIdSelect = document.getElementById("ownerId");
        var ownerIdOption = document.createElement("option");

        console.log("Account ->", accounts[i]);
        ownerIdOption.text = accounts[i];
        ownerIdOption.value = accounts[i];
        ownerIdSelect.options.add(ownerIdOption, i);

        var ownerSelect = document.getElementById("owner");
        var ownerOption = document.createElement("option");

        ownerOption.text = accounts[i];
        ownerOption.value = accounts[i];
        ownerSelect.options.add(ownerOption, i);

        var issuerSelect = document.getElementById("issuer");
        var issuerOption = document.createElement("option");

        issuerOption.text = accounts[i];
        issuerOption.value = accounts[i];
        issuerSelect.options.add(issuerOption, i);

        var approveClaimOwnerSelect = document.getElementById("approveClaimOwner");
        var approveClaimOwnerOption = document.createElement("option");

        approveClaimOwnerOption.text = accounts[i];
        approveClaimOwnerOption.value = accounts[i];
        approveClaimOwnerSelect.options.add(approveClaimOwnerOption, i);

        var shareClaimOwnerSelect = document.getElementById("shareClaimOwner");
        var shareClaimOwnerOption = document.createElement("option");

        shareClaimOwnerOption.text = accounts[i];
        shareClaimOwnerOption.value = accounts[i];
        shareClaimOwnerSelect.options.add(shareClaimOwnerOption, i);

        var shareClaimThirdPartySelect = document.getElementById("shareClaimThirdParty");
        var shareClaimThirdPartyOption = document.createElement("option");

        shareClaimThirdPartyOption.text = accounts[i];
        shareClaimThirdPartyOption.value = accounts[i];
        shareClaimThirdPartySelect.options.add(shareClaimThirdPartyOption, i);

        var verifyClaimOwnerSelect = document.getElementById("verifyClaimOwner");
        var verifyClaimOwnerOption = document.createElement("option");

        verifyClaimOwnerOption.text = accounts[i];
        verifyClaimOwnerOption.value = accounts[i];
        verifyClaimOwnerSelect.options.add(verifyClaimOwnerOption, i);

        var verifyClaimIssuerSelect = document.getElementById("verifyClaimIssuer");
        var verifyClaimIssuerOption = document.createElement("option");

        verifyClaimIssuerOption.text = accounts[i];
        verifyClaimIssuerOption.value = accounts[i];
        verifyClaimIssuerSelect.options.add(verifyClaimIssuerOption, i);


      }

      //self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  createIdentity: function() {
    var self = this;

    var name = document.getElementById("name").value;

    var ownerIdSelect = document.getElementById("ownerId");
    var ownerIdSelectedIndex = ownerIdSelect.selectedIndex;
    var ownerId = ownerIdSelect.options[ownerIdSelectedIndex].value;

    console.log("Selected owner Id -> ", ownerId);

    var ownerTypeSelect = document.getElementById("ownerType");
    var ownerTypeSelectedIndex = ownerTypeSelect.selectedIndex;
    var ownerType = ownerTypeSelect.options[ownerTypeSelectedIndex].value;

    console.log("Selected owner type -> ", ownerType);

    Identity.deployed().then(function(instance) {

      return instance.createIdentity(ownerId, ownerType, name, {from: ownerId});
    }).then(function(value) {
      self.setStatus("Identity created.");
      alert("Identity created.");
    }).catch(function(e) {
      console.log(e);
      alert("Error creating identity; see log.");
      self.setStatus("Error creating identity; see log.");
    });
   }
  ,

  createClaim: function() {
    var self = this;

    var data = document.getElementById("data").value;

    var ownerSelect = document.getElementById("owner");
    var ownerSelectedIndex = ownerSelect.selectedIndex;
    var owner = ownerSelect.options[ownerSelectedIndex].value;

    var issuerSelect = document.getElementById("issuer");
    var issuerSelectedIndex = issuerSelect.selectedIndex;
    var issuer = issuerSelect.options[issuerSelectedIndex].value;

    var claimTypeSelect = document.getElementById("claimType");
    var claimTypeSelectedIndex = claimTypeSelect.selectedIndex;
    var claimType = claimTypeSelect.options[claimTypeSelectedIndex].value;



    Identity.deployed().then(function(instance) {
      //meta = instance;
      return instance.createClaim(owner, issuer, web3.fromUtf8(data), claimType, {from: owner, gas: 3000000});
    }).then(function() {
      self.setStatus("Transaction complete!");
      alert("Claim created.");
      //self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      alert("Error creating claim; see log.");
      self.setStatus("Error creating claim; see log.");
    });
  }
  ,
  //
  getClaims: function() {
    var self = this;


    var approveClaimOwnerSelect = document.getElementById("approveClaimOwner");
    var approveClaimOwnerSelectedIndex = approveClaimOwnerSelect.selectedIndex;
    var approveClaimOwner = approveClaimOwnerSelect.options[approveClaimOwnerSelectedIndex].value;


    var identityInstance;
    Identity.deployed().then(function(instance) {
      identityInstance = instance;
      return instance.getClaims.call(approveClaimOwner, {from: approveClaimOwner});
    }).then(function(result) {
      self.setStatus("Transaction complete!");
      console.log("Result -> ", result);
      for(var i=0; i<result.length; i++){

        var approveClaimOwnerClaimSelect = document.getElementById("approveClaimOwnerClaims");
        var approveClaimOwnerClaimOption = document.createElement("option");

        console.log("Chaim ID ->", result[i]);
        approveClaimOwnerClaimOption.text = result[i];
        approveClaimOwnerClaimOption.value = result[i];
        approveClaimOwnerClaimSelect.options.add(approveClaimOwnerClaimOption, i);
        //return identityInstance.getClaimById.call(result[i], {from: approveClaimOwner});
      }
      //self.refreshBalance();
    // }).then(function(result){
    //   console.log("claim result -> ", result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting claims; see log.");
    });
  }
  ,
  //
  getClaimById: function() {
    var self = this;

    var approveClaimOwnerSelect = document.getElementById("approveClaimOwner");
    var approveClaimOwnerSelectedIndex = approveClaimOwnerSelect.selectedIndex;
    var approveClaimOwner = approveClaimOwnerSelect.options[approveClaimOwnerSelectedIndex].value;


    var approveClaimOwnerClaimSelect = document.getElementById("approveClaimOwnerClaims");
    var approveClaimOwnerClaimSelectedIndex = approveClaimOwnerClaimSelect.selectedIndex;
    var approveClaimOwnerClaim = approveClaimOwnerClaimSelect.options[approveClaimOwnerClaimSelectedIndex].value;


    var identityInstance;
    Identity.deployed().then(function(instance) {
      identityInstance = instance;
      return instance.getClaimById.call(approveClaimOwnerClaim, {from: approveClaimOwner});
    }).then(function(result) {
      self.setStatus("Transaction complete!");
      console.log("Result -> ", result);

      console.log("Data -> ", web3.toUtf8(result[2]));
      console.log("Cliam Type -> ", result[3].toNumber());
      console.log("Claim Status -> ", result[4].toNumber());

      var owner = result[0];
      var issuer = result[1];
      var claimStatus;
      var claimType;
      var action = "";
      if(result[3].toNumber() == 0){
        claimType = "Address Verification";
      }else if (result[3].toNumber() == 1){
        claimType = "Name Verification";
      }else if(result[3].toNumber() == 2){
        claimType = "Email Verification";
      }

      var approveParams = approveClaimOwnerClaim + "," + result[0] + "," + result[1] + "," + result[2] + "," + result[3];
      if(result[4].toNumber() == 0){
        claimStatus = "Created";
        action = "<button id=\"getClaimById\" class=\"btn btn-primary\" onclick=\"App.approveClaim(" + approveParams + ")\">Approve</button>";
      }else if (result[4].toNumber() == 1){
        claimStatus = "Approved";
      }else if (result[4].toNumber() == 2){
        claimStatus = "Rejected";
      }



      var claimData = web3.toUtf8(result[2]);



      var claimDetailsTable = $("#claimDetailsTable");
      var claimDetailsHtml = "<thead><tr><th>Owner</th><th>Issuer</th><th>Claim Type</th><th>Claim Status</th><th>Claim Data</th><th>Action</th></tr><thead>";
      claimDetailsHtml = "<tbody>" + claimDetailsHtml + "<tr><td>" + owner + "</td><td>" + issuer + "</td><td>" + claimType + "</td><td>" + claimStatus + "</td><td>" + claimData + "</td><td>" + action + "</td></tr></tbody>";
      claimDetailsTable.html(claimDetailsHtml);
      //self.refreshBalance();
    // }).then(function(result){
    //   console.log("claim result -> ", result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting claim details; see log.");
    });
  }
  ,

  approveClaim: function(claimId, owner, issuer, data, claimType) {

    console.log("Input data -> ", claimId, owner, issuer, data, claimType);

    var approveClaimOwnerSelect = document.getElementById("approveClaimOwner");
    var approveClaimOwnerSelectedIndex = approveClaimOwnerSelect.selectedIndex;
    var approveClaimOwner = approveClaimOwnerSelect.options[approveClaimOwnerSelectedIndex].value;

    var approveClaimOwnerClaimSelect = document.getElementById("approveClaimOwnerClaims");
    var approveClaimOwnerClaimSelectedIndex = approveClaimOwnerClaimSelect.selectedIndex;
    var approveClaimOwnerClaim = approveClaimOwnerClaimSelect.options[approveClaimOwnerClaimSelectedIndex].value;

    //var messageHash = web3.keccak256(owner, issuer, claimType, data);


    //var prefixedHash = keccak256("\x19Ethereum Signed Message:\n32", messageHash);

    //var signature = web3.eth.sign(messageHash, issuer);

    //console.log("Signature -> ", signature);

    var signature = "";



    console.log("Approving claim...");
    var self = this;


    var identityInstance;
    Identity.deployed().then(function(instance) {
      identityInstance = instance;
      return identityInstance.getClaimById.call(approveClaimOwnerClaim, {from: approveClaimOwner});
    }).then(function(result) {
      //meta = instance;
      return identityInstance.approveClaim(approveClaimOwnerClaim, result[0], result[1], result[3], web3.fromUtf8(signature), {from: result[1], gas: 3000000});
    }).then(function() {
      self.setStatus("Transaction complete!");
      alert("Claim approved!!!")
      //self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      alert("Error approving claim; see log.");
      self.setStatus("Error approving claim; see log.");
    });
  }
  ,
  //
  getClaimsShare: function() {
    var self = this;


    var shareClaimOwnerSelect = document.getElementById("shareClaimOwner");
    var shareClaimOwnerSelectedIndex = shareClaimOwnerSelect.selectedIndex;
    var shareClaimOwner = shareClaimOwnerSelect.options[shareClaimOwnerSelectedIndex].value;


    var identityInstance;
    Identity.deployed().then(function(instance) {
      identityInstance = instance;
      return instance.getClaims.call(shareClaimOwner, {from: shareClaimOwner});
    }).then(function(result) {
      self.setStatus("Transaction complete!");
      console.log("Result -> ", result);
      for(var i=0; i<result.length; i++){

        var shareClaimOwnerClaimSelect = document.getElementById("shareClaimOwnerClaims");
        var shareClaimOwnerClaimOption = document.createElement("option");

        console.log("Chaim ID ->", result[i]);
        shareClaimOwnerClaimOption.text = result[i];
        shareClaimOwnerClaimOption.value = result[i];
        shareClaimOwnerClaimSelect.options.add(shareClaimOwnerClaimOption, i);
        //return identityInstance.getClaimById.call(result[i], {from: approveClaimOwner});
      }
      //self.refreshBalance();
    // }).then(function(result){
    //   console.log("claim result -> ", result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting claims; see log.");
    });
  }
  ,
  //
  getClaimByIdShare: function() {
    var self = this;

    var shareClaimOwnerSelect = document.getElementById("shareClaimOwner");
    var shareClaimOwnerSelectedIndex = shareClaimOwnerSelect.selectedIndex;
    var shareClaimOwner = shareClaimOwnerSelect.options[shareClaimOwnerSelectedIndex].value;


    var shareClaimOwnerClaimSelect = document.getElementById("shareClaimOwnerClaims");
    var shareClaimOwnerClaimSelectedIndex = shareClaimOwnerClaimSelect.selectedIndex;
    var shareClaimOwnerClaim = shareClaimOwnerClaimSelect.options[shareClaimOwnerClaimSelectedIndex].value;


    var identityInstance;
    Identity.deployed().then(function(instance) {
      identityInstance = instance;
      return instance.getClaimById.call(shareClaimOwnerClaim, {from: shareClaimOwner});
    }).then(function(result) {
      self.setStatus("Transaction complete!");
      console.log("Result -> ", result);

      console.log("Data -> ", web3.toUtf8(result[2]));
      console.log("Cliam Type -> ", result[3].toNumber());
      console.log("Claim Status -> ", result[4].toNumber());

      var owner = result[0];
      var issuer = result[1];
      var claimStatus;
      var claimType;
      var action = "";
      if(result[3].toNumber() == 0){
        claimType = "Address Verification";
      }else if (result[3].toNumber() == 1){
        claimType = "Name Verification";
      }else if(result[3].toNumber() == 2){
        claimType = "Email Verification";
      }

      var shareParams = shareClaimOwnerClaim + "," + result[0] + "," + result[1] + "," + result[2] + "," + result[3];
      if(result[4].toNumber() == 0){
        claimStatus = "Created";
        //action = "<button id=\"getClaimByIdShare\" class=\"btn btn-primary\" onclick=\"App.shareClaim(" + shareParams + ")\">Share</button>";
      }else if (result[4].toNumber() == 1){
        claimStatus = "Approved";
      }else if (result[4].toNumber() == 2){
        claimStatus = "Rejected";
      }



      var claimData = web3.toUtf8(result[2]);



      var claimDetailsTable = $("#shareClaimDetailsTable");
      var claimDetailsHtml = "<thead><tr><th>Owner</th><th>Issuer</th><th>Claim Type</th><th>Claim Status</th><th>Claim Data</th></tr></thead>";
      claimDetailsHtml = "<tbody>" + claimDetailsHtml + "<tr><td>" + owner + "</td><td>" + issuer + "</td><td>" + claimType + "</td><td>" + claimStatus + "</td><td>" + claimData + "</td></tr><tbody>";
      claimDetailsTable.html(claimDetailsHtml);
      //self.refreshBalance();
    // }).then(function(result){
    //   console.log("claim result -> ", result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting claim details; see log.");
    });
  }
  ,

  shareClaim: function() {

    //console.log("Input data -> ", claimId, owner, issuer, data, claimType);

    var shareClaimOwnerSelect = document.getElementById("shareClaimOwner");
    var shareClaimOwnerSelectedIndex = shareClaimOwnerSelect.selectedIndex;
    var shareClaimOwner = shareClaimOwnerSelect.options[shareClaimOwnerSelectedIndex].value;

    var shareClaimOwnerClaimSelect = document.getElementById("shareClaimOwnerClaims");
    var shareClaimOwnerClaimSelectedIndex = shareClaimOwnerClaimSelect.selectedIndex;
    var shareClaimOwnerClaim = shareClaimOwnerClaimSelect.options[shareClaimOwnerClaimSelectedIndex].value;

    var shareClaimThirdPartySelect = document.getElementById("shareClaimThirdParty");
    var shareClaimThirdPartySelectedIndex = shareClaimThirdPartySelect.selectedIndex;
    var shareClaimThirdParty = shareClaimThirdPartySelect.options[shareClaimThirdPartySelectedIndex].value;

    //var messageHash = web3.keccak256(owner, issuer, claimType, data);


    //var prefixedHash = keccak256("\x19Ethereum Signed Message:\n32", messageHash);

    //var signature = web3.eth.sign(messageHash, issuer);

    //console.log("Signature -> ", signature);

    var signature = "";



    console.log("Sharing claim...");
    var self = this;


    var identityInstance;
    Identity.deployed().then(function(instance) {
      identityInstance = instance;

      //meta = instance;
      return identityInstance.shareClaim(shareClaimOwnerClaim, shareClaimThirdParty, {from: shareClaimOwner, gas: 3000000});
    }).then(function() {
      self.setStatus("Transaction complete!");
      alert("Claim shared.")
      //self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      alert("Error sharing claim; see log.")
      self.setStatus("Error sharing claim; see log.");
    });
  }

  ,
  // Verify Claim functions

  getClaimsVerify: function() {
    var self = this;


    var verifyClaimOwnerSelect = document.getElementById("verifyClaimOwner");
    var verifyClaimOwnerSelectedIndex = verifyClaimOwnerSelect.selectedIndex;
    var verifyClaimOwner = verifyClaimOwnerSelect.options[verifyClaimOwnerSelectedIndex].value;


    var identityInstance;
    Identity.deployed().then(function(instance) {
      identityInstance = instance;
      return instance.getClaims.call(verifyClaimOwner, {from: verifyClaimOwner});
    }).then(function(result) {
      self.setStatus("Transaction complete!");
      console.log("Result -> ", result);
      for(var i=0; i<result.length; i++){

        var verifyClaimOwnerClaimSelect = document.getElementById("verifyClaimOwnerClaims");
        var verifyClaimOwnerClaimOption = document.createElement("option");

        console.log("Chaim ID ->", result[i]);
        verifyClaimOwnerClaimOption.text = result[i];
        verifyClaimOwnerClaimOption.value = result[i];
        verifyClaimOwnerClaimSelect.options.add(verifyClaimOwnerClaimOption, i);
        //return identityInstance.getClaimById.call(result[i], {from: approveClaimOwner});
      }
      //self.refreshBalance();
    // }).then(function(result){
    //   console.log("claim result -> ", result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting claims; see log.");
    });
  }
  ,
  //
  getClaimByIdVerify: function() {
    var self = this;

    var verifyClaimOwnerSelect = document.getElementById("verifyClaimOwner");
    var verifyClaimOwnerSelectedIndex = verifyClaimOwnerSelect.selectedIndex;
    var verifyClaimOwner = verifyClaimOwnerSelect.options[verifyClaimOwnerSelectedIndex].value;


    var verifyClaimOwnerClaimSelect = document.getElementById("verifyClaimOwnerClaims");
    var verifyClaimOwnerClaimSelectedIndex = verifyClaimOwnerClaimSelect.selectedIndex;
    var verifyClaimOwnerClaim = verifyClaimOwnerClaimSelect.options[verifyClaimOwnerClaimSelectedIndex].value;


    var identityInstance;
    Identity.deployed().then(function(instance) {
      identityInstance = instance;
      return instance.getClaimById.call(verifyClaimOwnerClaim, {from: verifyClaimOwner});
    }).then(function(result) {
      self.setStatus("Transaction complete!");
      console.log("Result -> ", result);

      console.log("Data -> ", web3.toUtf8(result[2]));
      console.log("Cliam Type -> ", result[3].toNumber());
      console.log("Claim Status -> ", result[4].toNumber());

      var owner = result[0];
      var issuer = result[1];
      var claimStatus;
      var claimType;
      var action = "";
      if(result[3].toNumber() == 0){
        claimType = "Address Verification";
      }else if (result[3].toNumber() == 1){
        claimType = "Name Verification";
      }else if(result[3].toNumber() == 2){
        claimType = "Email Verification";
      }

      var shareParams = verifyClaimOwnerClaim + "," + result[0] + "," + result[1] + "," + result[2] + "," + result[3];
      if(result[4].toNumber() == 0){
        claimStatus = "Created";
        //action = "<button id=\"getClaimByIdShare\" class=\"btn btn-primary\" onclick=\"App.shareClaim(" + shareParams + ")\">Share</button>";
      }else if (result[4].toNumber() == 1){
        claimStatus = "Approved";
      }else if (result[4].toNumber() == 2){
        claimStatus = "Rejected";
      }



      var claimData = web3.toUtf8(result[2]);



      var claimDetailsTable = $("#verifyClaimDetailsTable");
      var claimDetailsHtml = "<thead><tr><th>Owner</th><th>Issuer</th><th>Claim Type</th><th>Claim Status</th><th>Claim Data</th></tr></thead>";
      claimDetailsHtml = "<tbody>" + claimDetailsHtml + "<tr><td>" + owner + "</td><td>" + issuer + "</td><td>" + claimType + "</td><td>" + claimStatus + "</td><td>" + claimData + "</td></tr><tbody>";
      claimDetailsTable.html(claimDetailsHtml);
      //self.refreshBalance();
    // }).then(function(result){
    //   console.log("claim result -> ", result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting claim details; see log.");
    });
  }
  ,

  verifyClaim: function() {

    //console.log("Input data -> ", claimId, owner, issuer, data, claimType);

    var verifyClaimOwnerSelect = document.getElementById("verifyClaimOwner");
    var verifyClaimOwnerSelectedIndex = verifyClaimOwnerSelect.selectedIndex;
    var verifyClaimOwner = verifyClaimOwnerSelect.options[verifyClaimOwnerSelectedIndex].value;

    var verifyClaimOwnerClaimSelect = document.getElementById("verifyClaimOwnerClaims");
    var verifyClaimOwnerClaimSelectedIndex = verifyClaimOwnerClaimSelect.selectedIndex;
    var verifyClaimOwnerClaim = verifyClaimOwnerClaimSelect.options[verifyClaimOwnerClaimSelectedIndex].value;

    var verifyClaimIssuerSelect = document.getElementById("verifyClaimIssuer");
    var veirfyClaimIssuerSelectedIndex = verifyClaimIssuerSelect.selectedIndex;
    var verifyClaimIssuer = verifyClaimIssuerSelect.options[veirfyClaimIssuerSelectedIndex].value;

    //var messageHash = web3.keccak256(owner, issuer, claimType, data);


    //var prefixedHash = keccak256("\x19Ethereum Signed Message:\n32", messageHash);

    //var signature = web3.eth.sign(messageHash, issuer);

    //console.log("Signature -> ", signature);

    var signature = "";



    console.log("verifying claim...");
    var self = this;


    var identityInstance;
    Identity.deployed().then(function(instance) {
      identityInstance = instance;

      //meta = instance;
      return identityInstance.verifyClaim(verifyClaimOwnerClaim, verifyClaimIssuer, {from: verifyClaimOwner, gas: 3000000});
    }).then(function(result) {
      self.setStatus("Transaction complete!");
      console.log(result);
      if(result == true){
      alert("Claim verified.")
    } else {
      alert("Claim not verified.")
    }
      //self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      alert("Error verifying claim; see log.")
      self.setStatus("Error verifying claim; see log.");
    });
  }


};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  // if (typeof web3 !== 'undefined') {
  //   console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
  //   // Use Mist/MetaMask's provider
  //   window.web3 = new Web3(web3.currentProvider);
  // } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  // }

  App.start();
});
