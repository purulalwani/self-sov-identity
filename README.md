# Self Sovreign Identity
Self sovereign identity based on blockchain(DLT).

# Tools required

* Ethereum JS VM - ganache or testrpc.
* Contract build and deplyment - Truffle.
* Server - webpack dev server.

# Build and Run

* cd self-sov-identity && npm install
* npm run build
* npm run dev

# Functions

* Create Identity – Create identity using your Blockchain keys for Individual, Organisation, Issuer etc.
* Create Claim – Create claim (I own this address, I own this name, I own this email etc.) and ask issuer to certify and verify this.    
* Approve Claim – Issuer approves the claim and sign the claim data so data can be provable.
* Share Claim – Claim data can be shared with relying party to prove yourself.
* Verify Claim – Relying party can verify claim data that data is certified and verified by trusted issuer.

_****Code is not for production use or with any warranty, it is just to prove concept with the minimum effort****_ 


# References

* Paper -> https://sovrin.org/wp-content/uploads/2017/06/The-Inevitable-Rise-of-Self-Sovereign-Identity.pdf
* ERC725 -> https://github.com/ethereum/EIPs/issues/725
* ERC735 -> https://github.com/ethereum/EIPs/issues/735
* Entity & Use cases -> https://w3c.github.io/vc-use-cases/ 

