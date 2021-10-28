import { ref, onMounted, watch } from "vue";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Storage } from "@capacitor/storage";

export function usePhotoGallery() {
  const takePhoto = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    const fileName = new Date().getTime() + ".jpeg";
    const savedFileImage = {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath,
    };

    photos.value = [savedFileImage, ...photos.value];
  };
  const photos = ref<UserPhoto[]>([]);

  return {
    photos,
    takePhoto,
  };
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
      resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});
