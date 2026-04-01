import axios from 'axios';

export const uploadMedia = async (file, onProgress) => {
  const formData = new FormData();

  formData.append('file', {
    uri: file.uri,
    type: file.type,
    name: file.fileName || `upload.${file.type.split('/')[1]}`,
  });

  return axios.post('https://your-api.com/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progress) => {
      if (!onProgress) return;
      const percent = Math.round(
        (progress.loaded * 100) / progress.total
      );
      onProgress(percent);
    },
  });
};
