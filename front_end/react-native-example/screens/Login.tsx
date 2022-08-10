import { hethers } from "@hashgraph/hethers";
import {
  Client,
  AccountId,
  TransferTransaction,
  AccountBalanceQuery,
  AccountInfoQuery,
  PrivateKey,
  Mnemonic,
  TransactionResponse,
  AccountInfo,
  AccountBalance,
  AccountCreateTransaction,
  Hbar,
} from "@hashgraph/sdk";
import * as SecureStore from "expo-secure-store";
import { Input, VStack, Text, Button, HStack, Center } from "native-base";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import { keyZip, keyPrivate, keyId, keyAccount } from "../constants";
interface props {
  setLogin: any;
}
const Login = (props: props) => {
  async function save(key: any, value: any) {
    await SecureStore.setItemAsync(key, value);
  }

  const [transaction, setTransaction] = useState<TransactionResponse | null>(
    null
  );
  const [info, setInfo] = useState<AccountInfo | null>(null);
  const [balance, setBalance] = useState<AccountBalance | null>(null);

  const [idStr, setIdStr] = useState("");
  const [keyStr, setKeyStr] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState(false);
  const operatorId = AccountId.fromString("0.0.47861614");
  const operatorKey = PrivateKey.fromString(
    "3030020100300706052b8104000a0422042067df6c854cc926d9811d0f2221db056bd99dd5cc64716b7692eee77e0d1b736a"
  );
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);
  const [mnemonic, setMnemonic] = useState<Mnemonic | null>(null);
  useEffect(() => {
    const init = async () => {
      try {
        const response = await new TransferTransaction()
          .addHbarTransfer(operatorId, -1)
          .addHbarTransfer("0.0.3", 1)
          .execute(client);
        setTransaction(response);
      } catch (err: any) {
        Alert.alert(err.toString());
      }
      try {
        const info = await new AccountInfoQuery()
          .setAccountId(operatorId)
          .execute(client);

        setInfo(info);
      } catch (err: any) {
        Alert.alert(err.toString());
      }

      try {
        const balance = await new AccountBalanceQuery()
          .setAccountId(operatorId)
          .execute(client);

        setBalance(balance);
      } catch (err: any) {
        Alert.alert(err.toString());
      }

      // try {
      //   const mnemonic = await Mnemonic.generate12();

      //   props.route.param.setMnemonic(mnemonic);
      // } catch (err: any) {
      //   Alert.alert(err.toString());
      // }
    };
    init();
  }, []);
  async function createNewUser() {
    try {
      const provider = hethers.providers.getDefaultProvider("testnet");

      const eoaAccount: any = {
        account: operatorId,
        privateKey: `0x${operatorKey.toStringRaw()}`, // Convert private key to short format using .toStringRaw()
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
      const int = await contract.register(false, zipCode, {
        gasLimit: 300000,
      });
      console.log(int);
    } catch (err) {}
    save(keyId, idStr);
    save(keyPrivate, keyStr);
    save(keyAccount, "user");
    save(keyZip, zipCode);
    props.setLogin(true);
  }
  async function createNewFacility() {
    
      try {
        const provider = hethers.providers.getDefaultProvider("testnet");

        const eoaAccount: any = {
          account: operatorId,
          privateKey: `0x${operatorKey.toStringRaw()}`, // Convert private key to short format using .toStringRaw()
        };
        const wallet = new hethers.Wallet(eoaAccount, provider);
        const abi = [
          "function register(bool _isCompany, string _zipCode) public",
          "function addComodityForSubmission(bytes32 _id, Comodity _comodity) public",
          "function addUserSubmission(address _company, bytes32 _id, UserSubmissions _userOrder) public",
          "function payBill(bytes32 orderId) public payable",
          "function claimEarnings(uint amount) public payable",
        ];

        const contract = new hethers.Contract(
          "0x0000000000000000000000000000000002da4f47",
          abi,
          wallet
        );
        const int = await contract.register(false, zipCode, {
          gasLimit: 300000,
        });
        console.log(int);
      } catch (err) {
        console.log(err)
      }
      save(keyZip, zipCode);
      save(keyId, idStr);
      save(keyPrivate, keyStr);
      save(keyAccount, "facility");
      props.setLogin(true);
  }

  return (
    <VStack space={4}>
      <Center><Text fontSize={30}>Login by Credientials</Text></Center>
      <Input
        value={idStr}
        placeholder="Enter Id"
        onChangeText={(text) => setIdStr(text)}
      ></Input>

      <Input
        value={keyStr}
        placeholder="Enter Key"
        onChangeText={(text) => setKeyStr(text)}
      ></Input>
      <Input
        value={zipCode}
        placeholder="Enter Zip Code"
        onChangeText={(text) => setZipCode(text)}
      ></Input>
      <Center>
        <HStack space={10}>
          <Button onPress={createNewUser}>Create New User</Button>
          <Button onPress={createNewFacility}>Create New Facility</Button>
        </HStack>
      </Center>

      {error ? <Text>Error</Text> : <></>}
    </VStack>
  );
};
export default Login;
