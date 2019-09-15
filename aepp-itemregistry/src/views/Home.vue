<template>
  <div>
    <h1>Identity of Things</h1><br /><br /><br />
    <h2>Domain of ItemRegistry</h2>
    {itemRegistryDomain}<br /><br />
    <h2>PublicKey of Item</h2>
    {publicKey}<br /><br />
    <h2>Random Message</h2>
    {randomMessage}<br /><br />
    <h2>Signature</h2>
    {signature}<br /><br />
    <h2>Valid item?</h2>
    {valid}
  </div>
</template>

<script>
  import aeternity from "../utils/aeternity";
  import itemRegistry from '../../../aepp-contracts/contracts/ItemRegistry.aes'
  import { sha256 } from 'js-sha256';
  import axios from 'axios';

  export default {
    name: 'Home',
    components: {},
    data() {
      return {
        contractAddress: null,
        itemRegistryDomain: null,
        publicKey: null,
        randomMessage: null,
        signature: null,
        valid: null
      };
    },


    async mounted() {
      await aeternity.initClient();

      const rolex2019Domain = "rolex2019.test";
      const rolex1970Domain = "rolex1970.test";

      const rolex2019Contract = await aeternity.client.getContractInstance(itemRegistry, {"contractAddress": "ct_2Kat1GhMtifixa3HZrmy7pCbGXVqpFDdjAA1qfcFwaCPdzCFuw"});
      console.log(rolex2019Contract);

      const rolex1970Contract = await aeternity.client.getContractInstance(itemRegistry, {"contractAddress": "ct_2u3bFXmPGnYFaU4UxBzMC7EWy8DG9PfnJHMrLsNHHZJuoMqTsc"});
      console.log(rolex1970Contract);

      const aensContractInstanceMap = new Map();

      aensContractInstanceMap.set(rolex2019Domain, rolex2019Contract);
      aensContractInstanceMap.set(rolex1970Domain, rolex1970Contract);

      let methodResult;

      function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
      }

      const publicKeyRolex2019 = "7328D16544D0484AABE68C2083CE41DFFE725BDBD5F170166532479CEE90A674A13A2E3846E2E6255CD7F7875304DC3732E8CFB6029EF25FBD0FCAE5E73852B1";
      const publicKeyRolex1970 = "0E6FBE920756972E3C0C13762899BEEE58F533D6746F97DC7911C07D6DBF68CEABC038BCC1E5C54A4AA51ADB74EB89D47DECC53EC3F1AA4AFA31294831092C8F";

      async function getPublicKey(){
          return await axios.get('http://localhost:8080/publicKey?pin=525257')
          .then(response => {
            console.log("Get Public Key");
            console.log(response.data);
            return response.data;
          })
      };

      async function getSignatureFromItem(msg){
        return await axios.post('http://localhost:8080/signature', {
          pin: '525257',
          message: msg
        })
        .then(function (response) {
          console.log(response);
          return response.data
        })
      };

      async function verifySignature(domain, publickey, message, signature) {
        return await aensContractInstanceMap.get(domain).methods.verifyItem(publickey, sha256(randomUUID), signature);
      }

      let publicKeyOfItem = await getPublicKey();
      this.publicKey = publicKeyOfItem;
      let randomUUID = uuidv4();
      this.randomMessage = randomUUID;
      let signature = await getSignatureFromItem(randomUUID);
      this.signature = signature;
      let isValid = await verifySignature(rolex1970Domain, publicKeyOfItem, randomUUID, signature);
      this.valid = isValid;
      console.log(isValid);

      /*
      console.log("#### GET CONTRACT INSTANCE ###")
      const contract = await aeternity.client.getContractInstance(itemRegistry);
      const itemLimit = 2;
      console.log("#### INIT / DEPLOY CONTRACT ###")
      const deploy = await contract.methods.init(itemLimit);
      console.log(deploy);
      console.log(deploy.address);
      console.log("#### SHOW WORKING CONTRACT INSTANCE");
      console.log(contract);
      console.log("#### GET CONTRACT INSTANCE FOR ALREADY DEPLOYED CONTRACT ###")
      */


/*       console.log("#### GENERATE SOME RANDOM UUID ###")
      const randomUUID = uuidv4();
      console.log(randomUUID);
      const signature = await getSignatureFromItem(randomUUID); */

/*       console.log("#### ACTIONS FOR ROLEX2019 CONTRACT ###")
 */      
/*       console.log("#### ADD ITEM ###")
      methodResult = await rolex2019Contract.methods.addItem(publicKeyRolex2019, "some metadata for item 1 in rolex2019 registry");
      console.log(methodResult); */
      
/*       console.log("#### GET ITEMS ###")
      methodResult = await rolex2019Contract.methods.getItems();
      console.log(methodResult);
      console.log("#### VERIFY SIGNATURE OF ITEM ###")
      methodResult = await rolex2019Contract.methods.verifyItem(publicKeyRolex2019, sha256(validMessage), signature);
      console.log(methodResult);
      console.log("#### EXPECTING FALSE VERIFICATION ###")
      methodResult = await rolex2019Contract.methods.verifyItem(publicKeyRolex2019, sha256(invalidMessage), signature);
      console.log(methodResult); */

/*       console.log("#### ACTIONS FOR ROLEX1970 CONTRACT ###")
 */      
/*       console.log("#### ADD ITEM ###")
      methodResult = await rolex1970Contract.methods.addItem(publicKeyRolex1970, "some metadata for item 1 in rolex1970 registry");
      console.log(methodResult); */
      
/*       console.log("#### GET ITEMS ###")
      methodResult = await rolex1970Contract.methods.getItems();
      console.log(methodResult);
      console.log("#### VERIFY SIGNATURE OF ITEM ###")
      methodResult = await rolex1970Contract.methods.verifyItem(publicKeyRolex1970, sha256(randomUUID), signature);
      console.log(methodResult);
      console.log("#### EXPECTING FALSE VERIFICATION ###")
      methodResult = await rolex1970Contract.methods.verifyItem(publicKeyRolex1970, sha256("this should be false"), signature);
      console.log(methodResult); */
    },
  };
</script>

<style scoped>

</style>
