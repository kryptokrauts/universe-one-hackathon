# Frontend
The frontend should provide following functionalities:

- **SmartContract**
    - deployment of a new registry contract
    - call the stateful `addItem` function with following params:
        - EDCSA signature based publickey of the product
        - metadata (e.g. serialno.) -> needs to be defined
    - call the `verifyItem` function with following params:
        - publickey of the product
        - message
        - signedMessage (which needs to be verified)
- **AENS**
    - create a new domain
    - point a contract-address to a domain
    - address-lookup for a given domain


## The whole process to be able to verify a product
1. deploy a registry contract
1. register new domain for the contract
1. point the contracts address to the domain
1. receive the publickey of the product from KeyCard via backend
1. add a product to the registry
1. on verification-request for a specific domain:
    1. generate random-message
    1. call the backend providing the random message (the backend then tells the KeyCard to sign the message and returns publickey and the signedMessage-hash)
    1. determine the contract address based on the domain
    1. call the `verifyProduct` function of the contract and provide all required parameters
    1. handle response from the contract