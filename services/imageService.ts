import { upload } from "cloudinary-react-native";
import { cld } from "@/config/cloudinaryConfig";
import { ResponseType } from "@/types";

export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    if (!file) return { success: true, data: null };

    if (typeof file === "string") return { success: true, data: file };

    let url: string | undefined;

    if (file && file.uri) {
      await upload(cld, {
        file: file.uri,
        options: {
          folder: folderName,
          unique_filename: true,
          allowed_formats: ["png", "jpg", "jpeg"],
        },
        callback: async (error, result) => {
          if (error) {
            throw new Error("Failed to upload image");
          } else {
            url = result?.secure_url;
          }
        },
      });
    }
    return { success: true, data: url };
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
