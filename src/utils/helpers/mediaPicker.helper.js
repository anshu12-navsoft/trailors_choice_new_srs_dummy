import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker, { isCancel, types } from "@react-native-documents/picker";

const photoOptions = {
  mediaType: 'photo',
  quality: 0.8,
  selectionLimit: 1,
  // saveToPhotos removed — required WRITE_EXTERNAL_STORAGE which was blocking on Android
};

export const openCamera = async () => {
  const res = await launchCamera(photoOptions);
  return handleImageResponse(res);
};

export const openGallery = async () => {
  const res = await launchImageLibrary(photoOptions);
  return handleImageResponse(res);
};

// Picks images OR PDF documents from the device file system
export const openDocumentPicker = async () => {
  const res = await DocumentPicker.pickSingle({
    type: [types.images, types.pdf],
    copyTo: 'cachesDirectory',
  });
  return {
    uri: res.fileCopyUri || res.uri,
    type: res.type || 'application/octet-stream',
    fileName: res.name,
  };
};

export { isCancel as isDocumentPickerCancel };

const handleImageResponse = (res) => {
  if (res.didCancel) return null;
  if (res.errorCode) throw new Error(res.errorMessage || res.errorCode);
  if (!res.assets?.length) return null;
  return res.assets[0];
};
