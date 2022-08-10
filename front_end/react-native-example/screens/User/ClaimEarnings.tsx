import { Button, Center, Input, Text, VStack } from "native-base";
import { useState } from "react";

const ClaimEarnings = () => {
  const [amountClaim, setAmountClaim] = useState("");
  const [amountToClaim, setAmountToClaim] = useState("");
  async function claimAmount() {}
  return (
    <VStack space={10} paddingTop={10}>
      <Center>
        <Text>Amount Claimable {amountClaim}</Text>
      </Center>
      <Input value={amountToClaim} onChangeText={setAmountToClaim}></Input>
      <Center>
        <Button onPress={claimAmount}>Claim Amount</Button>
      </Center>
    </VStack>
  );
};
export default ClaimEarnings;
