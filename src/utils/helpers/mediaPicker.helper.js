import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as DocumentPicker from '@react-native-documents/picker';

const photoOptions = {
  mediaType: 'photo',
  quality: 0.8,
  selectionLimit: 1,
};

export const openCamera = async () => {
  const res = await launchCamera(photoOptions);
  return handleImageResponse(res);
};

export const openGallery = async () => {
  const res = await launchImageLibrary(photoOptions);
  return handleImageResponse(res);
};

export const openDocumentPicker = async () => {
  try {
    console.log('Opening document picker...');

    const res = await DocumentPicker.pick({
      allowMultiSelection: false,
      type: ['image/*', 'application/pdf'],
    });

    console.log('RAW PICKER RESPONSE => ', JSON.stringify(res, null, 2));

    const file = Array.isArray(res) ? res[0] : res;

    if (!file) {
      return null;
    }

    return {
      uri: file.uri,
      type: file.type || 'application/octet-stream',
      fileName: file.name || 'document',
    };
  } catch (err) {
    console.log('Document picker FULL error => ', err);

    if (DocumentPicker.isCancel(err)) {
      return null;
    }

    throw err;
  }
};

export const isDocumentPickerCancel = DocumentPicker.isCancel;

const handleImageResponse = (res) => {
  if (res.didCancel) return null;

  if (res.errorCode) {
    throw new Error(res.errorMessage || res.errorCode);
  }

  if (!res.assets?.length) return null;

  return res.assets[0];
};