import { Text } from "native-base";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import User from "./User/User";
import RecyclingFacility from "./Resycle/RecyclingFacility";
import { keyZip, keyPrivate, keyId, keyAccount } from "../constants";
const Selection = () => {
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
  return (isUser?<User/>:<RecyclingFacility/>);
};
export default Selection;
