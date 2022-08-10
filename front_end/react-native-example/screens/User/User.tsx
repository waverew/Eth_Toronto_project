import { Button, CheckIcon, Text, VStack } from "native-base";
import { Select } from "native-base";
import { useState } from "react";
import { hethers } from "@hashgraph/hethers";
import { AccountCreateTransaction, Client, Hbar, Mnemonic, PrivateKey } from "@hashgraph/sdk";
import * as SecureStore from "expo-secure-store";
import {keyId, keyPrivate} from '../../constants'
const User = () => {
  let [service, setService] = useState("");
  
  async function getValueFor(key: any):Promise<string> {
    let result = await SecureStore.getItemAsync(key) as string;
    return result
  }
  async function addSubmission() {
    try {
        const operatorId = await getValueFor(keyId);
        const operatorKey = await getValueFor(keyPrivate)
      const provider = hethers.providers.getDefaultProvider("testnet");

      const eoaAccount: any = {
        account: operatorId,
        privateKey: `0x${operatorKey}`, // Convert private key to short format using .toStringRaw()
      };
      const wallet = new hethers.Wallet(eoaAccount, provider);
      const abi = [
        "function register(bool _isCompany, string _zipCode) public",
        "function addComodityForSubmission(bytes32 _id, Comodity _comodity) public",
        "function addUserSubmission(address _company, bytes32 _id, UserSubmissions _userOrder) public",
        "function payBill(bytes32 orderId) public payable",
        "function claimEarnings(uint amount) public payable",
      ];

      // Create a ContractFactory object
      const contract = new hethers.Contract(
        "0x0000000000000000000000000000000002da4f47",
        abi,
        wallet
      );
      const int = await contract.addUserSubmission(false, "M56 KSM", {
        gasLimit: 300000,
      });
      console.log(int);
    } catch (err) {}
  }
  return (
    <VStack>
      <Text>Select Item</Text>

      <Select
        selectedValue={service}
        minWidth="200"
        accessibilityLabel="Choose Comodity"
        placeholder="Choose Comodity"
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />,
        }}
        mt={1}
        onValueChange={(itemValue) => setService(itemValue)}
      >
        <Select.Item label="Glass Bottles" value="GB" />
        <Select.Item label="Aluminium Cans" value="AC" />
        <Select.Item label="Electonics" value="E" />
        <Select.Item label="Cardboard" value="CB" />
      </Select>

      <Button onPress={addSubmission}>Add Submission</Button>
    </VStack>
  );
};
export default User;
