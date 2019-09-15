const Ae = require('@aeternity/aepp-sdk').Universal;
const Deployer = require('forgae-lib').Deployer;

const sha256 = require('js-sha256').sha256;

const CONTRACT_PATH = "./contracts/ItemRegistry.aes";

const publicKey1 = "F3225AFC10CBEC2B0898375DE82B8A3DE4E0B44369BFCB7088045D74237918DFBB97E181A19F824019B6AB6FA622903B24922222E5843E1486E7BCABFDCA85B1";
const signature1 = "937C68893CBBB8B538257A9965FB1E12AECD59893775CB41354FA8B5184776616C0F0C926E7F88B6A689CD84EE05E85EFEE3532B297E7C45036257A09C9DE529";

const publicKey2 = "172C3391F4DD56604AFDCFF9DAB981F9079B0D38E0A9970C6439FB06B965E94CC25E24A9616DDDDB1907745E9A017644973F1B0CAAA3E18D870D95E0342571D0";

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
    });

    describe('Deploy contract', async () => {
        it('SUCCESS deploy and initialize', async () => {
            const limit = 2;

            deployedContractOwner = await deployer.deploy(CONTRACT_PATH, [limit]);
            contractAddress = deployedContractOwner.address;

            const limitResult = await deployedContractOwner.getLimit({callStatic: true});
            assert.equal(limitResult.decodedResult, limit);
        });
    });

    describe('Interact with contract', async () => {
        it('should verify a valid signature', async () => {
            let verificationResult = await deployedContractOwner.verifyItem(publicKey1, sha256(validMessage), signature1);
            assert.equal(verificationResult.decodedResult, true);
        });
        it('should NOT verify an invalid signature', async () => {
            let verificationResult = await deployedContractOwner.verifyItem(publicKey1, sha256(invalidMessage), signature1);
            assert.equal(verificationResult.decodedResult, false);
        });
        it('should be able to add an item', async () => {
            await deployedContractOwner.addItem(publicKey1, "some metadata");
        });
        it('should NOT be able to add item with same publicKey again', async () => {
            try {
                await deployedContractOwner.addItem(publicKey1, "some metadata");
                assert.fail(); 
            } catch (e) {
                console.log(e.decodedError);
            }
        });
        it('should be able to add another valid item', async () => {
            await deployedContractOwner.addItem(publicKey2, "some other metadata");
        });
        it('should NOT be able to add an item after limit is reached', async () => {
            try {
                await deployedContractOwner.addItem(publicKey2, "some other metadata");
                assert.fail(); 
            } catch (e) {
                console.log(e.decodedError);
            }
        });
    });
});