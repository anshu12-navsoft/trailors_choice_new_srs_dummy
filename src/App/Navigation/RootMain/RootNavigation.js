import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from '../Drawer/DrawerNavigation';
import { useSelector } from 'react-redux';
import { AuthStack } from '../StackTabs/StackNavigation';

const RootNavigation = () => {
  const isLoggedIn  = useSelector(state => state.auth.isLoggedIn);
  const loggedOut   = useSelector(state => state.auth.loggedOut);
  return (
    <NavigationContainer>
      {isLoggedIn
        ? <DrawerNavigation />
        : <AuthStack initialRouteName={loggedOut ? 'Login' : 'LanguageSelect'} />
      }
    </NavigationContainer>
  );
};

export default RootNavigation;
