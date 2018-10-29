import axios from 'axios';
import { notification } from 'antd';

const UPLOAD_API = `${process.env.REACT_APP_API_ROOT}/posts/upload`;

export function validateImage(file) {
  if (!file) {
    return false;
  }

  if (!file.type.match(/png|jpg|jpeg|gif/)) { // because `accept` doesn't work on some browsers
    notification['error']({ message: 'You can only upload standard image files (png, gif, jpg).' });
    return false;
  }

  if (file.size / 1024 / 1024 >= 5) {
    notification['error']({ message: 'Image file size must be smaller than 5MB.' });
    return false;
  }

  return true;
}

export async function uploadImage(file, onSuccess, onFail, onUploadProgress = null) {
  const formData = new FormData();
  if (validateImage(file)) {
    formData.append("image", file);
    await axios.post(UPLOAD_API, formData, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: onUploadProgress })
      .then(onSuccess).catch(onFail);
  }
}
