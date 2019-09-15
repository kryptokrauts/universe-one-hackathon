<template>
  <div>
    <h1>Account</h1>
    {{address}}
    <h1>Balance</h1>
    {{balance}} AE
  </div>
</template>

<script>
  import aeternity from "../utils/aeternity";
  import itemRegistry from '../../../aepp-contracts/contracts/ItemRegistry.aes'
  import { sha256 } from 'js-sha256';

  export default {
    name: 'Home',
    components: {},
    data() {
      return {
        address: null,
        balance: null,
        contractAddress: null
      };
    },


    async mounted() {
      await aeternity.initClient();

      let methodResult;

      function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
      }

      console.log("#### GENERATE SOME RANDOM UUID ###")
      const randomUUID = uuidv4();
      console.log(randomUUID);

      const validMessage = "Something";
      const invalidMessage = "invalid";

      const publicKeyRolex2019 = "F3225AFC10CBEC2B0898375DE82B8A3DE4E0B44369BFCB7088045D74237918DFBB97E181A19F824019B6AB6FA622903B24922222E5843E1486E7BCABFDCA85B1";
      const publicKeyRolex1970 = "0E6FBE920756972E3C0C13762899BEEE58F533D6746F97DC7911C07D6DBF68CEABC038BCC1E5C54A4AA51ADB74EB89D47DECC53EC3F1AA4AFA31294831092C8F";

      const signature = "937C68893CBBB8B538257A9965FB1E12AECD59893775CB41354FA8B5184776616C0F0C926E7F88B6A689CD84EE05E85EFEE3532B297E7C45036257A09C9DE529";

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


      const rolex2019Domain = "rolex2019.test";
      const rolex1970Domain = "rolex1970.test";
      const aensContractMap = new Map();
      aensContractMap.set(rolex2019Domain, "ct_2Kat1GhMtifixa3HZrmy7pCbGXVqpFDdjAA1qfcFwaCPdzCFuw");
      aensContractMap.set(rolex1970Domain, "ct_2u3bFXmPGnYFaU4UxBzMC7EWy8DG9PfnJHMrLsNHHZJuoMqTsc");

      const rolex2019Contract = await aeternity.client.getContractInstance(itemRegistry, {"contractAddress": aensContractMap.get(rolex2019Domain)});
      console.log(rolex2019Contract);

      const rolex1970Contract = await aeternity.client.getContractInstance(itemRegistry, {"contractAddress": aensContractMap.get(rolex1970Domain)});
      console.log(rolex1970Contract);

      console.log("#### ACTIONS FOR ROLEX2019 CONTRACT ###")
      
/*       console.log("#### ADD ITEM ###")
      methodResult = await rolex2019Contract.methods.addItem(publicKeyRolex2019, "some metadata for item 1 in rolex2019 registry");
      console.log(methodResult); */
      
      console.log("#### GET ITEMS ###")
      methodResult = await rolex2019Contract.methods.getItems();
      console.log(methodResult);
      console.log("#### VERIFY SIGNATURE OF ITEM ###")
      methodResult = await rolex2019Contract.methods.verifyItem(publicKeyRolex2019, sha256(validMessage), signature);
      console.log(methodResult);
      console.log("#### EXPECTING FALSE VERIFICATION ###")
      methodResult = await rolex2019Contract.methods.verifyItem(publicKeyRolex2019, sha256(invalidMessage), signature);
      console.log(methodResult);

      console.log("#### ACTIONS FOR ROLEX1970 CONTRACT ###")
      
/*       console.log("#### ADD ITEM ###")
      methodResult = await rolex1970Contract.methods.addItem(publicKeyRolex1970, "some metadata for item 1 in rolex1970 registry");
      console.log(methodResult); */
      
      console.log("#### GET ITEMS ###")
      methodResult = await rolex1970Contract.methods.getItems();
      console.log(methodResult);
      console.log("#### VERIFY SIGNATURE OF ITEM ###")
      methodResult = await rolex1970Contract.methods.verifyItem(publicKeyRolex1970, sha256(validMessage), signature);
      console.log(methodResult);
      console.log("#### EXPECTING FALSE VERIFICATION ###")
      methodResult = await rolex1970Contract.methods.verifyItem(publicKeyRolex1970, sha256(invalidMessage), signature);
      console.log(methodResult);

      this.address = aeternity.address;
      this.balance = aeternity.balance;
    },
  };
</script>

<style scoped>

</style>
