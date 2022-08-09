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
} from "@hashgraph/sdk";
import * as SecureStore from "expo-secure-store";
import { Input, VStack, Text, Button, HStack } from "native-base";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

interface props {
  setLogin:any
}
const Login = (props:props) => {
  async function save(key: any, value: any) {
    await SecureStore.setItemAsync(key, value);
  }

  async function getValueFor(key: any) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      alert("🔐 Here's your value 🔐 \n" + result);
    } else {
      alert("No values stored under that key.");
    }
  }
  const [transaction, setTransaction] = useState<TransactionResponse | null>(
    null
  );
  const [info, setInfo] = useState<AccountInfo | null>(null);
  const [balance, setBalance] = useState<AccountBalance | null>(null);

  const [mnemonicStr, setMnemonicStr] = useState("");
  const [error, setError] = useState(false);
  const operatorId = AccountId.fromString("0.0.47439");
  const operatorKey = PrivateKey.fromString(
    "302e020100300506032b6570042204208f4014a3f7f7a6c7147070da98d88f9cea074c13ed0554783471825d801888cf"
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
  async function createNew() {
    try {
      const mnemonic = await Mnemonic.generate12();

      setMnemonic(mnemonic);
      save("key",mnemonic.toString())
      props.setLogin(true)
    } catch (err: any) {
      Alert.alert(err.toString());
    }
  }
  async function fromString() {
    try {
      const mnemonic = await Mnemonic.fromString(mnemonicStr);
      setMnemonic(mnemonic);
      save("key",mnemonic.toString())
      props.setLogin(true)
    } catch (err: any) {
      Alert.alert(err.toString());
      setError(true);
    }
  }
  return (
    <VStack space={4}>
      <Text>Enter Mnemonic</Text>
      <Input
        value={mnemonicStr}
        onChangeText={(text) => setMnemonicStr(text)}
      ></Input>

      <Button onPress={fromString}>Make from Mnemonic</Button>
      <Button onPress={createNew}>Genrate New</Button>

      {error ? <Text>Error</Text> : <></>}
      
    </VStack>
  );
};
export default Login;
