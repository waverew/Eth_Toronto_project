import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Client, AccountId, PrivateKey, Mnemonic } from "@hashgraph/sdk";

import { NativeBaseProvider, Stack } from "native-base";
import Login from "./screens/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Account from "./screens/Account";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontasio from 'react-native-vector-icons/Fontisto';
import * as SecureStore from "expo-secure-store";
import RecyclingFacility from "./screens/Resycle/RecyclingFacility";
import User from "./screens/User/User";
import Selection from "./screens/Selection";
import { keyAccount } from "./constants";
import Orders from "./screens/Order/Orders";
import SelectionAccount from "./screens/SelectionAccount";
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
  const [login, setLogin] = useState(false)
  const Tab = createBottomTabNavigator();

  async function getValueFor(key: any) {
    let result = await SecureStore.getItemAsync(key);
    return result
  }
  useEffect(()=>{
    getValueFor(keyAccount).then((value)=>{
      if(value===undefined){
        console.log("undefined")
      }
      if(value===null){
        console.log("null")
      }else if(value=="facility"){

      }
      else if (value=="user"){
        console.log("else")
        
        setLogin(true)
      }
      console.log(value)
    })
    

  },[])
  return (
    <NativeBaseProvider>
      {login?(
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName:string="";

            if (route.name === 'Update') {
              iconName = focused
                ? 'add-circle'
                : 'add-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }else if (route.name === 'Order') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }
            else if (route.name === 'Account') {
              iconName = focused ? 'money-symbol' : 'money-symbol';
            }
            if(route.name === 'Account'){
              return <Fontasio name={iconName} size={size} color={color}></Fontasio>
            }
//money-symbol
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}>
          <Tab.Screen name="Update" component={Selection} />
          
          <Tab.Screen name="Account" component={SelectionAccount} />
          <Tab.Screen name="Settings" component={Account} />
        </Tab.Navigator>
      </NavigationContainer>):<SafeAreaView><Login setLogin={setLogin}/></SafeAreaView>}
      
    </NativeBaseProvider>
  );
};

export default App;
