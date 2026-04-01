import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const commonOptions = {
  mediaType: 'mixed', // image + video
  quality: 0.8,
  videoQuality: 'high',
  selectionLimit: 1,
  saveToPhotos: true,
};

export const openCamera = async () => {
  const res = await launchCamera(commonOptions);
  return handleResponse(res);
};

export const openGallery = async () => {
  const res = await launchImageLibrary(commonOptions);
  return handleResponse(res);
};

const handleResponse = (res) => {
  if (res.didCancel) return null;
  if (res.errorCode) throw new Error(res.errorMessage);
  return res.assets[0];
};
