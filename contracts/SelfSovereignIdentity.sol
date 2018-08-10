pragma solidity ^0.4.21;
//pragma experimental ABIEncoderV2;

contract SelfSovereignIdentity {


 enum OwnerType {Individual, Organization, Issuer}

 struct Identity{
     address ownerId;
     OwnerType ownerType;
     string ownerName;
     uint32 claimCount;
     bytes32[] claims;

 }

 enum ClaimType {Address, Name, Email}
 enum ClaimStatus {Created, Verified, Rejected}

 struct Claim{
     address owner;
     address issuer;
     bytes data;
     bytes signature;
     address signedBy;
     ClaimType claimType;
     ClaimStatus claimStatus;

 }

 mapping(address => Identity ) identities;

 mapping(bytes32 => Claim) claims;

 event IdentityCreated(address _owner, OwnerType ownerType);
 event ClaimCreated();


 function createIdentity(address _owner, uint _ownerType, string _ownerName) public returns(address) {


    bytes32[] storage tmpClaims;
    identities[_owner] = Identity({ownerId: _owner,
          ownerType: OwnerType(_ownerType), ownerName: _ownerName
          , claimCount:0, claims:tmpClaims});


    return _owner;

 }

 function getIdentity(address _owner) public constant returns (address, OwnerType, string, uint32) {

     return (identities[_owner].ownerId, identities[_owner].ownerType, identities[_owner].ownerName, identities[_owner].claimCount);
 }

 function createClaim(address _owner, address _issuer, bytes _data, uint _claimType) public returns(bytes32) {


    bytes32 claimId = keccak256(_owner, _issuer, _claimType);

    claims[claimId] = Claim({owner: _owner,
            issuer: _issuer,
            data: _data,
            signature: "",
            signedBy: 0x0,
            claimType: ClaimType(_claimType),
            claimStatus:ClaimStatus.Created});

    identities[_owner].claims.push(claimId);
    identities[_owner].claimCount++;
    identities[_issuer].claims.push(claimId);
    identities[_issuer].claimCount++;

    //return identities[_owner].claimCount;
    return claimId;
 }

 function getClaims(address _owner) public constant returns(bytes32[]){
     return identities[_owner].claims;
 }

 function getClaimById(bytes32 _claimId) public constant returns(address, address, bytes, ClaimType, ClaimStatus){
     return (claims[_claimId].owner, claims[_claimId].issuer, claims[_claimId].data, claims[_claimId].claimType, claims[_claimId].claimStatus);
 }

 function approveClaim(bytes32 _claimId, address _owner, address _issuer, uint _claimType, bytes _signature) public returns(bool) {



    //Claim memory claim = claims[_claimId];

    if(_owner == claims[_claimId].owner &&
       _issuer == claims[_claimId].issuer &&
       ClaimType(_claimType) == claims[_claimId].claimType){
           claims[_claimId].signature = _signature;
           claims[_claimId].signedBy = msg.sender;
           claims[_claimId].claimStatus = ClaimStatus.Verified;

       }

    //claims[_claimId] = claim;



    return true;



 }

 function shareClaim(bytes32 _claimId, address _relyingParty) public returns(bool){


     identities[_relyingParty].claims.push(_claimId);


     return true;
 }

 function verifyClaim(bytes32 _claimId, address _issuer) public constant returns(bool) {



    Claim memory claim = claims[_claimId];

    if(_issuer != claim.signedBy){
        return false;
    }

    //bytes32 dataHash = keccak256(claim.owner, claim.issuer, claim.claimType, claim.data);
    //bytes32 prefixedHash = keccak256("\x19Ethereum Signed Message:\n32", dataHash);

    // Recover address of data signer
    //address recovered = getRecoveredAddress(claim.signature, prefixedHash);

    // Take hash of recovered address
    //bytes32 hashedAddr = keccak256(recovered);

    // if(_owner == claim.owner &&
    //   _issuer == claim.issuer &&
    //   ClaimType(_claimType) == claim.claimType){


    //   }

    // claims[_claimId] = claim;



    return true; //recovered == _issuer;



 }

 function getRecoveredAddress(bytes sig, bytes32 dataHash)
      public
      view
      returns (address addr)
  {
      bytes32 ra;
      bytes32 sa;
      uint8 va;

      // Check the signature length
      if (sig.length != 65) {
        return (0);
      }

      // Divide the signature in r, s and v variables
      assembly {
        ra := mload(add(sig, 32))
        sa := mload(add(sig, 64))
        va := byte(0, mload(add(sig, 96)))
      }

      if (va < 27) {
        va += 27;
      }

      address recoveredAddress = ecrecover(dataHash, va, ra, sa);

      return (recoveredAddress);
  }

}
