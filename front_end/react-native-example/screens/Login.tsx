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
  navigation: any;
  route: any;
}
const Login = (props: props) => {
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

  useEffect(() => {
    const init = async () => {
      try {
        const response = await new TransferTransaction()
          .addHbarTransfer(props.route.param.operatorId, -1)
          .addHbarTransfer("0.0.3", 1)
          .execute(props.route.param.client);
        setTransaction(response);
      } catch (err: any) {
        Alert.alert(err.toString());
      }
      try {
        const info = await new AccountInfoQuery()
          .setAccountId(props.route.param.operatorId)
          .execute(props.route.param.client);

        setInfo(info);
      } catch (err: any) {
        Alert.alert(err.toString());
      }

      try {
        const balance = await new AccountBalanceQuery()
          .setAccountId(props.route.param.operatorId)
          .execute(props.route.param.client);

        setBalance(balance);
      } catch (err: any) {
        Alert.alert(err.toString());
      }

      try {
        const mnemonic = await Mnemonic.generate12();

        props.route.param.setMnemonic(mnemonic);
      } catch (err: any) {
        Alert.alert(err.toString());
      }
    };
    //init();
  }, []);
  async function createNew() {
    try {
      const mnemonic = await Mnemonic.generate12();

      props.route.param.setMnemonic(mnemonic);
      save("key",mnemonic.toString())
    } catch (err: any) {
      Alert.alert(err.toString());
    }
  }
  async function fromString() {
    try {
      const mnemonic = await Mnemonic.fromString(mnemonicStr);
      props.route.param.setMnemonic(mnemonic);
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
        onChangeText={(text) => setMnemonicStr(text)}>

      </Input>

      <Button onPress={fromString}>Make from Mnemonic</Button>
      <Button onPress={createNew}>Generate New</Button>

      {error ? <Text>Error</Text> : <></>}
      {transaction && (
        <Text testID="transactionId">
          TransactionId: {transaction.transactionId.toString()}
        </Text>
      )}
      {info && <Text testID="info">Info: {info.accountId.toString()}</Text>}

      {balance && (
        <Text testID="balance">Balance: {balance.hbars.toString()}</Text>
      )}
    </VStack>
  );
};
export default Login;
