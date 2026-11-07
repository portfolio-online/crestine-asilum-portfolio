import { MAX_WORK_SAMPLE_FILE_SIZE_BYTES, WORK_SAMPLE_FILE_TYPES } from "./portfolio-context";

export type WorkSampleAttachment = {
  name: string;
  dataUrl: string;
};

export const workSampleFileAccept = Object.values(WORK_SAMPLE_FILE_TYPES).flat().join(",");

export function readWorkSampleFile(file: File): Promise<WorkSampleAttachment> {
  if (file.size > MAX_WORK_SAMPLE_FILE_SIZE_BYTES) {
    return Promise.reject(new Error("Choose a file smaller than 2 MB."));
  }
  if (!Object.hasOwn(WORK_SAMPLE_FILE_TYPES, file.type)) {
    return Promise.reject(
      new Error("Choose a PDF, Word, Excel, PowerPoint, or image file (JPG, PNG, GIF, or WEBP)."),
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("The selected file could not be read."));
        return;
      }

      resolve({ name: file.name, dataUrl: reader.result });
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("The selected file could not be read."));
    reader.onabort = () => reject(new Error("Reading the selected file was cancelled."));
    reader.readAsDataURL(file);
  });
}
