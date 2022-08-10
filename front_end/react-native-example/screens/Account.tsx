import { Button, Center, HStack, Input, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { keyZip, keyPrivate, keyId, keyAccount } from "../constants";
const Account = () => {
  const [privateKey, setPrivateKey] = useState("");
  const [id, setId] = useState("");
  const [zip, setZip] = useState("");
  const [account, setAccount] = useState("");
  async function getValueFor(key: any) {
    let result = await SecureStore.getItemAsync(key);
    return result;
  }
  async function save(key: any, value: any) {
    await SecureStore.setItemAsync(key, value);
  }
  async function loadData(){
    const id = await getValueFor(keyId) as string;
    const privateKey = await getValueFor(keyPrivate) as string;
    const zip = await getValueFor(keyZip) as string;
    const acc = await getValueFor(keyAccount) as string;
    setId(id)
    setPrivateKey(privateKey)
    setZip(zip)
    setAccount(acc)
  }
  async function saveValues(){
    save(keyId, id)
    save(keyZip, zip)
    save(keyPrivate, privateKey)
    save(keyAccount, account)
    setAccount(account)
  }
  useEffect(()=>{
    loadData()
  },[])
  return (
    <VStack>
      
        <Text>Private Key</Text>
        <Input value={privateKey} onChangeText={setPrivateKey}></Input>
      
      
        <Text>Id</Text>
        <Input value={id} onChangeText={setPrivateKey}></Input>
      
      
        <Text>Zip</Text>
        <Input value={zip} onChangeText={setZip}></Input>
        <Text>account</Text>
        <Input value={account} onChangeText={setAccount}></Input>
      
      <Center>
        <Button onPress={saveValues}>Save</Button>
      </Center>
    </VStack>
  );
};
export default Account;
