const Ae = require('@aeternity/aepp-sdk').Universal;
const Deployer = require('forgae-lib').Deployer;

const sha256 = require('js-sha256').sha256;

const CONTRACT_PATH = "./contracts/ItemRegistry.aes";

const publicKey1 = "0E6FBE920756972E3C0C13762899BEEE58F533D6746F97DC7911C07D6DBF68CEABC038BCC1E5C54A4AA51ADB74EB89D47DECC53EC3F1AA4AFA31294831092C8F";
const signature1 = "3E635917F052DF04C0BC536D0B927659A6F35B545596357BB8E629D3344BD9597E0A3DA3C4CF6A40B8B42C32FAD3002B8847F68601EB25FD89B895B70B1D2BC9";

const publicKey2 = "172C3391F4DD56604AFDCFF9DAB981F9079B0D38E0A9970C6439FB06B965E94CC25E24A9616DDDDB1907745E9A017644973F1B0CAAA3E18D870D95E0342571D0";

const validMessage = "kryptokrauts rocks!";
const invalidMessage = "some invalid crap";

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
        it('should NOT verify a valid signature if item does not exist in registry', async () => {
            try {
                let verificationResult = await deployedContractOwner.verifyItem(publicKey1, sha256(validMessage), signature1);
                assert.equal(verificationResult.decodedResult, false);
            } catch (e) {
                console.log(e.decodedError);
            }
        });
        it('should be able to add an item', async () => {
            await deployedContractOwner.addItem(publicKey1, "some metadata");
            console.log(await deployedContractOwner.getItems());
        });
        it('should verify a valid signature if item exists in registry', async () => {
            let verificationResult = await deployedContractOwner.verifyItem(publicKey1, sha256(validMessage), signature1);
            assert.equal(verificationResult.decodedResult, true);
        });
        it('should NOT verify a signature for a wrong message', async () => {
            let verificationResult = await deployedContractOwner.verifyItem(publicKey1, sha256(invalidMessage), signature1);
            assert.equal(verificationResult.decodedResult, false);
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