import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
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

    deleteTransactionsByWalletId(walletId);

    return { success: true, msg: "Wallet deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting the wallet: ", error);
    return { success: false, msg: error.message };
  }
};

const deleteTransactionsByWalletId = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransactions = true;

    while (hasMoreTransactions) {
      const transactionQuery = query(
        collection(db, "transactions"),
        where("walletId", "==", walletId)
      );

      const transactionSnapshot = await getDocs(transactionQuery);

      if (transactionSnapshot.size == 0) {
        hasMoreTransactions = false;
        break;
      }

      const batch = writeBatch(db);

      transactionSnapshot.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref);
      });

      await batch.commit();
    }

    return {
      success: true,
      msg: "All transactions deleted successfully!",
    };

    return { success: true, msg: "Wallet deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting the wallet: ", error);
    return { success: false, msg: error.message };
  }
};
