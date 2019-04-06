import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomeScreen from '../screens/Home'

const AppNavigator = createStackNavigator({
  Home: HomeScreen
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