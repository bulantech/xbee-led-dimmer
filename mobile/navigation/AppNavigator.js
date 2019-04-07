import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomeScreen from '../screens/Home'
import ZoneScreen from '../screens/Zone'

const AppNavigator = createStackNavigator({
  Home: HomeScreen,
  Zone: ZoneScreen
},
{
  initialRouteName: "Home"
});

const AppContainer = createAppContainer(AppNavigator);

export default class MainNavigator extends React.Component {
  render() {
    return <AppContainer />;
  }
}