// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainMenu from './screens/MainMenuScreen';
import GameScreen from './screens/GameScreen';
import DeckScreen from './screens/DeckScreen';
import ShopScreen from './screens/ShopScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainMenu">
        <Stack.Screen name="MainMenu" component={MainMenu} options={{ headerShown: false }} />
        <Stack.Screen name="GameScreen" component={GameScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DeckScreen" component={DeckScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ShopScreen" component={ShopScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
