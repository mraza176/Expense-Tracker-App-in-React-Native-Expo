import axios from "axios";
import { ResponseType } from "@/types";

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUD_NAME}/image/upload`;

export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    if (!file) return { success: true, data: null };

    if (typeof file === "string") return { success: true, data: file };

    if (file && file.uri) {
      const formData = new FormData();
      formData.append("file", {
        uri: file?.uri,
        type: "image/jpeg",
        name: file?.uri?.split("/").pop() || "image.jpg",
      } as any);
      formData.append("upload_preset", process.env.EXPO_PUBLIC_CLOUD_PRESET!);
      formData.append("folder", folderName);

      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { success: true, data: response.data.secure_url };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, msg: error.message || "Failed to upload image" };
  }
};

export const getProfileImage = (file: any) => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object") return file.uri;

  return require("@/assets/images/defaultAvatar.png");
};

export const getFilePath = (file: any) => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object") return file.uri;

  return null;
};
