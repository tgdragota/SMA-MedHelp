// App.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginComponent from './LogIn';
import SignupComponent from './Signup';
import MenuPage from './HomePacient';
import {LogBox} from 'react-native';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginComponent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Signup"
          component={SignupComponent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Menu"
          component={MenuPage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
