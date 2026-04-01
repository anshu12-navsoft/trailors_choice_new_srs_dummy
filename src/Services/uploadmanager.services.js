import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  uploadMedia  from '../Services/upload.service';

const QUEUE_KEY = 'PENDING_UPLOADS';

export const tryUpload = async (file, onProgress) => {
  const state = await NetInfo.fetch();

  if (!state.isConnected) {
    await saveToQueue(file);
    return { queued: true };
  }

  await uploadMedia(file, onProgress);
  return { uploaded: true };
};

const saveToQueue = async (file) => {
  const queue = JSON.parse(
    await AsyncStorage.getItem(QUEUE_KEY)
  ) || [];

  queue.push(file);
  await AsyncStorage.setItem(
    QUEUE_KEY,
    JSON.stringify(queue)
  );
};

export const retryPendingUploads = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return;

  const queue = JSON.parse(
    await AsyncStorage.getItem(QUEUE_KEY)
  ) || [];

  for (let file of queue) {
    await uploadMedia(file);
  }

  await AsyncStorage.removeItem(QUEUE_KEY);
};
