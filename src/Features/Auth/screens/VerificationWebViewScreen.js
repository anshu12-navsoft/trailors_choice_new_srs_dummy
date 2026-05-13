import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../App/Redux/Slices/authSlice';

const VerificationWebViewScreen = ({ navigation, route }) => {
  const { verification_url } = route.params || {};
  const dispatch = useDispatch();
  const done = useRef(false);

  const handleNavigationChange = navState => {
    if (done.current) return;
    const { url } = navState;
    if (url && !url.includes('veriff.com')) {
      done.current = true;
      dispatch(loginSuccess());
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomNavigation' }],
      });
    }
  };

  // const handleShouldStartLoad = ({ url }) => {
  //   if (done.current) return false;
  //   if (url && !url.includes('veriff.com')) {
  //     done.current = true;
  //     dispatch(loginSuccess());

  //     return false;
  //   }
  //   return true;
  // };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Icon name="arrow-left" size={moderateScale(22)} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Identity Verification</Text>
        <View style={{ width: moderateScale(22) }} />
      </View>
      <WebView
        source={{ uri: verification_url }}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        thirdPartyCookiesEnabled
        onNavigationStateChange={handleNavigationChange}
        // onShouldStartLoadWithRequest={handleShouldStartLoad}
        renderLoading={() => (
          <ActivityIndicator
            style={StyleSheet.absoluteFill}
            size="large"
            color="#3B5BDB"
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(14),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#111827',
  },
});

export default VerificationWebViewScreen;
