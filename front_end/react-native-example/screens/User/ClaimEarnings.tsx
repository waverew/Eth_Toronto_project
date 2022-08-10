import { Button, Center, Input, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { keyId, keyPrivate } from "../../constants";
const ClaimEarnings = () => {
  const [amountClaim, setAmountClaim] = useState("");
  const [amountToClaim, setAmountToClaim] = useState("");
  async function claimAmount() {
    alert("Amount claimed")
    const valId = await getValueFor(keyId)
    
    const req = await fetch(
        "http://localhost:3000/claimEarning",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: valId.replaceAll('.',"_"),
            amount:amountToClaim
          }),
        }
      );
      const jj =await  req.json()
      const val = jj["amount"]
      console.log(jj)
    setAmountClaim(val)
  }
  async function getValueFor(key: any): Promise<string> {
    let result = (await SecureStore.getItemAsync(key)) as string;
    return result;
  }
  async function getTotal(){
    const valId = await getValueFor(keyId)
    try{
        const req = await fetch(
            "http://localhost:3000/getClamableAmount",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: valId.replaceAll('.',"_"),
              }),
            }
          );
          const jj = await req.json()
          const val = jj["amount"]
          console.log(val)
          setAmountClaim(val)
    }catch(err){
        console.log(err)
    }
    
    //setAmountClaim(await req.text())
  }
  useEffect(()=>{
    getTotal()
  })
  return (
    <VStack space={10} paddingTop={10}>
      <Center><Text fontSize={30}>Claim Rewards </Text></Center>
      <Center>
        
        <Text>Amount Claimable: {amountClaim}</Text>
      </Center>
      <Input value={amountToClaim} onChangeText={setAmountToClaim}></Input>
      <Center>
        <Button onPress={claimAmount}>Claim Amount</Button>
      </Center>
    </VStack>
  );
};
export default ClaimEarnings;
