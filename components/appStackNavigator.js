import * as React from "react";
import {createStackNavigator} from 'react-navigation-stack';
import ExchangeScreen from "../screens/exchangeScreen";
import ExchangeScreen from '../screens/exchangeScreen';
import HomeScreen from '../screens/HomeScreen';

export const AppStackNavigator =createStackNavigator({
    Exchange:{
        screen:ExchangeScreen,
        navigationOptions:{
            headerShown:false
        }
    },
    Home:{
        screen:HomeScreen,
        navigationOptions:{
            headerShown:false
        }
    },
},
{
    initialRouteName:"Home"
}
)