// src/services/BiometricService.js

import ReactNativeBiometrics, {
  BiometryTypes,
} from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true, // Android PIN / Pattern fallback
});

/**
 * Check if biometrics is supported on device
 */
export const isBiometricSupported = async () => {
  const { available } = await rnBiometrics.isSensorAvailable();
  return available;
};

/**
 * Get biometric type (FaceID / TouchID / Biometrics)
 */
export const getBiometricType = async () => {
  const { biometryType } = await rnBiometrics.isSensorAvailable();
  return biometryType;
};

/**
 * Enable biometrics for a user
 */
export const enableBiometrics = async (
  userId,
  sendPublicKeyToServer,
) => {
  const { available } = await rnBiometrics.isSensorAvailable();

  if (!available) {
    throw new Error('Biometrics not available or not enrolled');
  }

  const { keysExist } =
    await rnBiometrics.biometricKeysExist();

  let publicKey;

  if (!keysExist) {
    const result = await rnBiometrics.createKeys();
    publicKey = result.publicKey;
  }

  // Send key only once
  if (publicKey) {
    await sendPublicKeyToServer(userId, publicKey);
  }

  await AsyncStorage.setItem(
    `BIOMETRIC_ENABLED_${userId}`,
    'true',
  );

  return true;
};

/**
 * Check if biometrics is enabled for user
 */
export const isBiometricEnabled = async (userId) => {
  const enabled = await AsyncStorage.getItem(
    `BIOMETRIC_ENABLED_${userId}`,
  );
  return enabled === 'true';
};

/**
 * Login using biometrics
 */
export const loginWithBiometrics = async (
  userId,
  verifySignatureWithServer,
) => {
  const enabled = await isBiometricEnabled(userId);

  if (!enabled) {
    throw new Error('Biometrics not enabled for this user');
  }

  const payload = `${userId}__${Date.now()}`;

  const { success, signature } =
    await rnBiometrics.createSignature({
      promptMessage: 'Login using biometrics',
      payload,
    });

  if (!success) {
    throw new Error('Biometric authentication failed');
  }

  await verifySignatureWithServer({
    userId,
    payload,
    signature, 
  });

  return true;
};
