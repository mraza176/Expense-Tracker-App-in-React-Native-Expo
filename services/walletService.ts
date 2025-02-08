import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { ResponseType, WalletType } from "@/types";
import { uploadFileToCloudinary } from "./imageService";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };

    if (walletData.image) {
      const res = await uploadFileToCloudinary(
        walletData.image,
        "expense-tracker/wallets"
      );
      if (!res.success)
        return {
          success: false,
          msg: res.msg || "Failed to upload wallet icon",
        };
      walletToSave.image = res.data;
    }

    if (!walletData.id) {
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    const walletRef = walletData?.id
      ? doc(db, "wallets", walletData?.id)
      : doc(collection(db, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true });

    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    console.error("Error creating or updating the wallet: ", error);
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    await deleteDoc(doc(db, "wallets", walletId));
    return { success: true, msg: "Wallet deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting the wallet: ", error);
    return { success: false, msg: error.message };
  }
};
