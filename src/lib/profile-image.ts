import { MAX_PROFILE_IMAGE_SIZE_BYTES, PROFILE_IMAGE_TYPES } from "./portfolio-context";

export const profileImageFileAccept = Object.values(PROFILE_IMAGE_TYPES).flat().join(",");

export function readProfileImageFile(file: File): Promise<string> {
  if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
    return Promise.reject(new Error("Choose an image smaller than 2 MB."));
  }
  if (!Object.hasOwn(PROFILE_IMAGE_TYPES, file.type)) {
    return Promise.reject(new Error("Choose a JPG, PNG, GIF, or WEBP image."));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("The selected image could not be read."));
        return;
      }

      resolve(reader.result);
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("The selected image could not be read."));
    reader.onabort = () => reject(new Error("Reading the selected image was cancelled."));
    reader.readAsDataURL(file);
  });
}
