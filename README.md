**Identity of Things**

**The Problem**
- when you want to buy luxury products (e.g. a Rolex) you are not able to verify whether it is a fake or not
- when you receive products (e.g. medicine) in any company involved in a supply chain you can't be sure whether the package content is being compromised in between

**The solution**
- a miniscule tamperproof nfc-chip with a secure element (where private keys can't get compromised) is included in the product or package
- to verfiy the authenticity of the product the nfc-chip is being used to sign messages
- the public keys of selected products are stored in different smart contract registries which addresses can be accessed through via AENS
- the registry smart contract (e.g. "Rolex 2019 limited") provides a function to verify the signed message and confirm the authenticity of a product

For demonstration purposes we will make use of a JavaCard (https://keycard.status.im/).