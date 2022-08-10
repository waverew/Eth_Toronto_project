import { Text } from "native-base";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { keyZip, keyPrivate, keyId, keyAccount } from "../constants";
import PayBill from "./Resycle/PayBill";
import ClaimEarnings from "./User/ClaimEarnings";
const SelectionAccount = () => {
  const [isUser, setIsUser] = useState(false);
  async function getValueFor(key: any) {
    let result = await SecureStore.getItemAsync(key);
    return result;
  }
  useEffect(() => {
    getValueFor(keyAccount).then((value) => {
      if (value == "user") {

        setIsUser(true);
      } else {
        console.log("facility")
        setIsUser(false);
      }
    });
  },[]);
  return (isUser?<ClaimEarnings/>:<PayBill/>);
};
export default SelectionAccount;
