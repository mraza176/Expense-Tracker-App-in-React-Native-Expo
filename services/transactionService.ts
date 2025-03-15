import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { uploadFileToCloudinary } from "./imageService";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;

    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data!" };
    }

    if (id) {
      // Update the transaction
    } else {
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      );
      if (!res.success) return res;
    }

    if (image) {
      const res = await uploadFileToCloudinary(
        image,
        "expense-tracker/transactions"
      );
      if (!res.success)
        return { success: false, msg: res.msg || "Failed to upload receipt" };
      transactionData.image = res.data;
    }

    const transactionRef = id
      ? doc(db, "transactions", id)
      : doc(collection(db, "transactions"));

    await setDoc(transactionRef, transactionData, { merge: true });

    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (error: any) {
    console.error("Error creating or updating the transaction: ", error);
    return { success: false, msg: error.message };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletSnapshot = await getDoc(doc(db, "wallets", walletId));

    if (!walletSnapshot.exists()) {
      return { success: false, msg: "Wallet not found!" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    if (type === "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Selected wallet don't have enough balance!",
      };
    }

    const updateType = type === "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type === "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;
    const updatedTotals =
      type === "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(doc(db, "wallets", walletId), {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating wallet for new transaction: ", error);
    return { success: false, msg: error.message };
  }
};
