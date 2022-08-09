import { Text } from "native-base";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import User from "./User/User";
import RecyclingFacility from "./Resycle/RecyclingFacility";
const Selection = () => {
  const [isUser, setIsUser] = useState(false);
  async function getValueFor(key: any) {
    let result = await SecureStore.getItemAsync(key);
    return result;
  }
  useEffect(() => {
    getValueFor("account").then((value) => {
      if (value == "user") {
        setIsUser(true);
      } else {
        setIsUser(false);
      }
    });
  },[]);
  return (isUser?<User/>:<RecyclingFacility/>);
};
export default Selection;
