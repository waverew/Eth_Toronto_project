import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Client, AccountId, PrivateKey, Mnemonic } from "@hashgraph/sdk";

import { NativeBaseProvider, Stack } from "native-base";
import Login from "./screens/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RecyclingFacility from "./screens/RecyclingFacility";
import Account from "./screens/Account";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SecureStore from "expo-secure-store";
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
    if (result) {
      //alert("🔐 Here's your value 🔐 \n" + result);
    } else {
      //alert("No values stored under that key.");
    }
  }
  useEffect(()=>{
    getValueFor("key").then((value)=>{
      if(value===undefined){

      }else{
        setLogin(true)
      }
    })

  })
  return (
    <NativeBaseProvider>
      {login?(<NavigationContainer>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName:string="";

            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-home'
                : 'ios-home-outline';
            } else if (route.name === 'Account') {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}>
          <Tab.Screen name="Home" component={RecyclingFacility} />
          <Tab.Screen name="Account" component={Account} />
        </Tab.Navigator>
      </NavigationContainer>):<SafeAreaView><Login setLogin={setLogin}/></SafeAreaView>}
      
    </NativeBaseProvider>
  );
};

export default App;
