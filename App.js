import * as React from 'react';
import { StatusBar, View, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './src/App/Redux/Store/store';
import { ThemeProvider } from './src/Theme/ThemeContext';
import RootNavigation from './src/App/Navigation/RootMain/RootNavigation';
import './src/Services/bilingual_il8n/index';
import { useSessionTimeout } from './src/Services/sessionTimeout.service';
import { logoutUser } from './src/App/Redux/Slices/authSlice';

/* Inner component so it has access to Redux + ThemeContext */
const AppContent = () => {
  const isDark = useSelector(state => state.theme.isDark);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const panHandlers = useSessionTimeout({
    enabled: isLoggedIn,
    onExpire: () => {
      Alert.alert(
        'Session Expired',
        'You have been inactive for 30 minutes. Please log in again.',
        [{ text: 'OK', onPress: () => dispatch(logoutUser()) }],
        { cancelable: false },
      );
    },
  });

  return (
    <View style={{ flex: 1 }} {...panHandlers}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#FFFFFF'}
      />
      <RootNavigation />
    </View>
  );
};

const App = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  </Provider>
);

export default App;
