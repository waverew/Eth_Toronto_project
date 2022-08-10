import { BigNumber, hethers } from "@hashgraph/hethers";
import { VStack, Text, Input, Button, Select, CheckIcon } from "native-base";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import DropDownPicker from "react-native-dropdown-picker";
import { keyId, keyPrivate } from "../../constants";
const RecyclingFacility = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [service, setService] = useState("");
  const [bytesId, setBytesId] = useState("");
  const [price, setprice] = useState("");
  const [amount, setAmount] = useState("");
  const [pickUpTime, setPickUpTime] = useState("");
  const [pickUpTimeTo, setPickUpTimeTo] = useState("");
  const [days, setDays] = useState("");
  const [zip, setZip] = useState("");
  const [campain, setCampain] = useState("");
  const [items, setItems] = useState([
    { label: "Aluminum", value: "aluminum" },
    { label: "Plastic", value: "plastic" },
    { label: "Paper", value: "paper" },
    { label: "Batteries", value: "batteries" },
    { label: "Electronics", value: "electronics" },
    { label: "Steel", value: "steel" },
    { label: "Iron", value: "iron" },
  ]);
  function generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0; //Time in microseconds since page-load or 0 if unsupported
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {
        //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        //Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
  async function getValueFor(key: any): Promise<string> {
    let result = (await SecureStore.getItemAsync(key)) as string;
    return result;
  }
  function toHex(str:string) {
    var result = '';
    for (var i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }
  async function submitOrder() {
    try {
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
        "0x0000000000000000000000000000000002da5148",
        abi,
        wallet
      );
      interface com {
        amount:Number;
        type:string;
        price:Number;
      }
      const hex = toHex(bytesId)
      console.log(hex)
      const k:com = {amount:Number(amount), price:Number(price), type:service}
      const int = await contract.addComodityForSubmission(
        '0x'+hex,
        BigNumber.from(price),
        BigNumber.from(amount),
        service,
        {
          gasLimit: 300000,
        }
      );
      await fetch("http://localhost:3000/setCompanyItemList", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: operatorId.replaceAll('.','_'),
          itemName: service,
          areaCode:zip,
          sellingPricePerKg: price,
          pickupTimeFrom: pickUpTime,
          pickupTimeTo: pickUpTimeTo,
          days: days,
          campaignDays:campain,
          orderId: hex,

        }),
      });
      alert("Added The Commodity")
      console.log(int);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    const v = generateUUID();
    const val = encodeURI(v).split(/%..|./).length - 1;
    setBytesId(v);
  }, []);
  return (
    <VStack space="4">
      <Input placeholder="Amount" onChangeText={setAmount}></Input>
      <Input placeholder="Zip Code" onChangeText={setZip}></Input>
      <Input placeholder="price" onChangeText={setprice}></Input>
      <Input placeholder="pickup time" onChangeText={setPickUpTime}></Input>
      <Input
        placeholder="pickup time to"
        onChangeText={setPickUpTimeTo}
      ></Input>
      <Input placeholder="days" onChangeText={setDays}></Input>
      <Input placeholder="Campain Days" onChangeText={setCampain}></Input>
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
      <Button onPress={submitOrder}>Submit</Button>
    </VStack>
  );
};

export default RecyclingFacility;
