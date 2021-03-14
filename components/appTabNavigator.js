import * as React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import HomeScreen from "../screens/HomeScreen";
import ExchangeScreen from "../screens/exchangeScreen";
export const AppTabNavigator = createBottomTabNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: "Home",
    },
  },
  ExchangeScreen: {
    screen: ExchangeScreen,
    navigationOptions: {
      tabBarLabel: "Exchange",
    },
  },
});
