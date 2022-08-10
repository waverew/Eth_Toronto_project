import { Button, Center, CheckIcon, Input, Text, VStack } from "native-base";
import { Select } from "native-base";
import { useEffect, useState } from "react";
import { hethers } from "@hashgraph/hethers";
import {
  AccountCreateTransaction,
  Client,
  Hbar,
  Mnemonic,
  PrivateKey,
} from "@hashgraph/sdk";
import * as SecureStore from "expo-secure-store";
import { keyId, keyPrivate } from "../../constants";
import { SafeAreaView } from "react-native";
const User = () => {
  const [service, setService] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [weight, setWeight] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [schedule, setSchedule] = useState("");
  useEffect(() => {}, []);
  async function getValueFor(key: any): Promise<string> {
    let result = (await SecureStore.getItemAsync(key)) as string;
    return result;
  }
  async function addSubmission() {}
  async function setData() {
    const re = await fetch(
      "http://localhost:3000/getCompanyItemListPerAreaCode",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemName: service,
          areaCode: areaCode,
        }),
      }
    );
    const json = await re.json();

    for (const key in json[0]) {
      const val = json[0][key][service][areaCode];
      for (const k in val) {
        const orderId = k;
        const vals = val[k];
        const price = vals["sellingPricePerKg"];
        const timeFrom = vals["pickupTimeFrom"];
        const timeTo = vals["pickupTimeTo"];
        const days = vals["days"];
        if(days.includes("1")){
            setSchedule("Please put bins out on Monday")
        }
        if(days.includes("2")){
            setSchedule("Please put bins out on Tuesday")
        }
        if(days.includes("3")){
            setSchedule("Please put bins out on Wednesday")
        }
        if(days.includes("4")){
            setSchedule("Please put bins out on Thursday")
        }
        if(days.includes("5")){
            setSchedule("Please put bins out on friday")
        }
        if(days.includes("6")){
            setSchedule("Please put bins out on saturday")
        }
        if(days.includes("7")){
            setSchedule("Please put bins out on Sunday")
        }
        const address = vals["companyAddress"];
        
        const valId = await getValueFor(keyId);
        try {
          const req = await fetch("http://localhost:3000/userSubmission", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              price: price,
              amount: weight,
              userId: valId,
              orderId: orderId,
              companyId: key,
            }),
          });
          console.log(req);
          const operatorId = await getValueFor(keyId);
          const operatorKey = await getValueFor(keyPrivate);
          const provider = hethers.providers.getDefaultProvider("testnet");

          const eoaAccount: any = {
            account: operatorId,
            privateKey: `0x${operatorKey}`, // Convert private key to short format using .toStringRaw()
          };
          const wallet = new hethers.Wallet(eoaAccount, provider);
          const abi = [
            "function register(bool _isCompany, string _zipCode) public",
            "function addComodityForSubmission(bytes32 _id, uint _price, uint _amount, string memory _typeOfComodity)",
            "function addUserSubmission(address _company, bytes32 _id,uint _price, uint _amount, string memory _typeOfCommodity) public",
            "function payBill(bytes32 orderId) public payable",
            "function claimEarnings(uint amount) public payable",
          ];

          // Create a ContractFactory object
          const contract = new hethers.Contract(
            "0x0000000000000000000000000000000002da4f47",
            abi,
            wallet
          );
          console.log(orderId);
          const int = await contract.addUserSubmission(
            address,
            "0x" + orderId,
            price,
            weight,
            service,
            {
              gasLimit: 300000,
            }
          );
          console.log(int);
        } catch (err) {
          console.log(err);
        }
      }
    }
    // setCompanyId(json[0][0]);
    // const com= json[0][0];
    // console.log(json[0][0])
    // const jj = json[0]
    // console.log(com)
    // console.log(jj[com])
  }
  return (
    <SafeAreaView>
    <VStack space={10}>
        
        <Center><Text fontSize={30}>Add Items for Pickup </Text></Center>
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
        <Select.Item label="GlassBottles" value="GlassBottles" />
        <Select.Item label="AluminiumCans" value="AluminiumCans" />
        <Select.Item label="Electonics" value="Electonics" />
        <Select.Item label="Cardboard" value="Cardboard" />
      </Select>
      <Input
        value={weight}
        onChangeText={setWeight}
        placeholder="Weight"
      ></Input>
      <Input
        value={areaCode}
        onChangeText={setAreaCode}
        placeholder="Area Code"
      ></Input>
      <Button onPress={setData}>Add Submission</Button>
      <Text>{schedule}</Text>
    </VStack>
    </SafeAreaView>
  );
};
export default User;
