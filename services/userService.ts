import { db } from "@/config/firebaseConfig";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  try {
    await updateDoc(doc(db, "users", uid), updatedData);
    return { success: true, msg: "User updated successfully" };
  } catch (error: any) {
    console.error(error);
    return { success: false, msg: error?.message };
  }
};
