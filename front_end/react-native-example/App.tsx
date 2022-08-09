import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";


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

import { NativeBaseProvider, Stack } from "native-base";
import Login from "./screens/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    padding: 20,
  },
});

const App = () => {
  const operatorId = AccountId.fromString("0.0.47439");
  const operatorKey = PrivateKey.fromString(
    "302e020100300506032b6570042204208f4014a3f7f7a6c7147070da98d88f9cea074c13ed0554783471825d801888cf"
  );
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);
  const [mnemonic, setMnemonic] = useState<Mnemonic | null>(null);
  const [route, setRoute] = useState("");
  const Stack = createNativeStackNavigator();
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            
            initialParams={{
              operatorId: operatorId,
              client: client,
              setMnemonic: setMnemonic,
            }}
          />
          {/* <Stack.Screen
            name="Login"
            component={Login}
            options={{}}
            initialParams={{
              operatorId: operatorId,
              client: client,
              setMnemonic: setMnemonic,
            }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
