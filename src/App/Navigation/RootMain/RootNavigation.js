import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from '../Drawer/DrawerNavigation';
import { useSelector } from 'react-redux';
import { AuthStack } from '../StackTabs/StackNavigation';

const RootNavigation = () => {
  console.log('DrawerNavigation:', DrawerNavigation);
  console.log('AuthStack:', AuthStack);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  return (
    <NavigationContainer>
      {isLoggedIn ? <DrawerNavigation /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigation;
