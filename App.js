import * as React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/App/Redux/Store/store';
import { ThemeProvider } from './src/Theme/ThemeContext';
import RootNavigation from './src/App/Navigation/RootMain/RootNavigation';
import './src/Services/bilingual_il8n/index';

/* Inner component so it has access to Redux + ThemeContext */
const AppContent = () => {
  const isDark = useSelector(state => state.theme.isDark);

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#FFFFFF'}
      />
      <RootNavigation />
    </>
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
