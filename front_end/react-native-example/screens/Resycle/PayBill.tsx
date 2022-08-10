import { Button, Center, Input, Text, VStack } from "native-base";
import { useState } from "react";
import { SafeAreaView } from "react-native";

const PayBill = () => {
  const [amount, setAmount] = useState("");
  function pay() {
    //todo
    alert(amount + " paid");
  }
  return (
    <SafeAreaView>
    <Center>
      <VStack space={10}>
      <Center><Text fontSize={30}>Pay Users </Text></Center>
        <Input
          value={amount}
          width={200}
          marginTop={10}
          onChangeText={setAmount}
        />
        <Button onPress={pay}>Pay</Button>
      </VStack>
    </Center>
    </SafeAreaView>
  );
};
export default PayBill;
