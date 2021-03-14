import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import SignupLoginScreen from "./screens/LoginScreen";
import { AppDrawerNavigator } from "./components/appDrawerNavigator";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

export default function App() {
  return <AppContainer />;
}

const switchNavigator = createSwitchNavigator({
  SignupLoginScreen: { screen: SignupLoginScreen },
  Drawer: { screen: AppDrawerNavigator },
});

const AppContainer = createAppContainer(switchNavigator);
