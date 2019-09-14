const Ae = require('@aeternity/aepp-sdk').Universal;
const Deployer = require('forgae-lib').Deployer;

const sha256 = require('js-sha256').sha256;

const CONTRACT_PATH = "./contracts/ItemRegistry.aes";

const publicKey = "F3225AFC10CBEC2B0898375DE82B8A3DE4E0B44369BFCB7088045D74237918DFBB97E181A19F824019B6AB6FA622903B24922222E5843E1486E7BCABFDCA85B1";
const signature = "937C68893CBBB8B538257A9965FB1E12AECD59893775CB41354FA8B5184776616C0F0C926E7F88B6A689CD84EE05E85EFEE3532B297E7C45036257A09C9DE529";
const validMessage = "Something";
const invalidMessage = "nandanistcool";

const config = {
    host: "http://localhost:3001/",
    internalHost: "http://localhost:3001/internal/",
    compilerUrl: "http://localhost:3080"
};

describe('ItemRegistry Contract', () => {
    let contractAddress;
    let deployer;
    let deployedContractOwner;
    
    let ownerKeyPair = wallets[0];
    let recipientOneKeyPair = wallets[1];

    before(async () => {
        deployer = new Deployer('local', ownerKeyPair.secretKey)

        clientOwner = await Ae({
            url: config.host,
            internalUrl: config.internalHost,
            compilerUrl: config.compilerUrl,
            keypair: ownerKeyPair,
            nativeMode: true,
            networkId: 'ae_devnet'
        });

        clientRecipientOne = await Ae({
            url: config.host,
            internalUrl: config.internalHost,
            compilerUrl: config.compilerUrl,
            keypair: recipientOneKeyPair,
            nativeMode: true,
            networkId: 'ae_devnet'
        });
    });

    describe('Deploy contract', async () => {
        it('SUCCESS deploy and initialize', async () => {
            const limit = 1;

            deployedContractOwner = await deployer.deploy(CONTRACT_PATH, [limit]);
            //deployedContractRecipientOne = await deployedContractOwner.from(recipientOneKeyPair.secretKey);
            contractAddress = deployedContractOwner.address;

            const limitResult = await deployedContractOwner.getLimit({callStatic: true});
            assert.equal(limitResult.decodedResult, limit);
            // console.log(limitResult);
        });
    });

    describe('Interact with contract', async () => {
        it('should verify a valid signature', async () => {
            let verificationResult = await deployedContractOwner.verifyItem(publicKey, sha256(validMessage), signature);
            assert.equal(verificationResult.decodedResult, true);
        });
        it('should not verify an invalid signature', async () => {
            let verificationResult = await deployedContractOwner.verifyItem(publicKey, sha256(invalidMessage), signature);
            assert.equal(verificationResult.decodedResult, false);
        });
    });
});