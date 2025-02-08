import { db } from "@/config/firebaseConfig";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  try {
    if (updatedData.image && updatedData?.image?.uri) {
      const res = await uploadFileToCloudinary(
        updatedData.image,
        "expense-tracker"
      );
      if (!res.success)
        return { success: false, msg: res.msg || "Failed to upload image" };
      updatedData.image = res.data;
    }
    await updateDoc(doc(db, "users", uid), updatedData);
    return { success: true, msg: "User updated successfully" };
  } catch (error: any) {
    console.error(error);
    return { success: false, msg: error?.message };
  }
};
