import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Trash } from "phosphor-react-native";
// import { Dropdown } from "react-native-element-dropdown";
import { Picker } from "@react-native-picker/picker";
import { orderBy, where } from "firebase/firestore";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { TransactionType, WalletType } from "@/types";
import { useAuth } from "@/contexts/authContext";
import { expenseCategories, transactionTypes } from "@/constants/data";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import ImageUpload from "@/components/ImageUpload";
import useFetchData from "@/hooks/useFetchData";
import {
  createOrUpdateTransaction,
  deleteTransaction,
} from "@/services/transactionService";

const TransactionModal = () => {
  const { user } = useAuth();

  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {
    data: wallets,
    loading: walletLoading,
    error: walletError,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  type paramType = {
    id: string;
    type: string;
    amount: string;
    category?: string;
    date: string;
    description?: string;
    image?: any;
    uid?: string;
    walletId: string;
  };

  const oldTransaction: paramType = useLocalSearchParams();

  const onDateChange = (
    _event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(false);
  };

  useEffect(() => {
    if (oldTransaction?.id)
      setTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction?.amount),
        description: oldTransaction?.description || "",
        category: oldTransaction?.category || "",
        date: new Date(oldTransaction?.date),
        walletId: oldTransaction?.walletId,
        image: oldTransaction?.image,
      });
  }, []);

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;
    if (!walletId || !date || !amount || (type === "expense" && !category)) {
      Alert.alert("Error", "Please fill all the required fields");
      return;
    }

    const transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image: image ? image : null,
      uid: user?.uid,
    };

    if (oldTransaction?.id) transactionData.id = oldTransaction.id;

    setLoading(true);
    const res = await createOrUpdateTransaction(transactionData);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this transaction?",
      [
        { text: "CANCEL", style: "cancel" },
        {
          text: "DELETE",
          style: "destructive",
          onPress: async () => {
            if (!oldTransaction.id) return;
            setLoading(true);
            const res = await deleteTransaction(
              oldTransaction?.id,
              oldTransaction?.walletId
            );
            setLoading(false);
            if (res.success) {
              router.back();
            } else {
              Alert.alert("Error", res.msg);
            }
          },
        },
      ],
      { userInterfaceStyle: "dark" }
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Update Transaction" : "New Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <KeyboardAvoidingView behavior="position" style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.form}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>
                Transaction Type
              </Typo>
              {/* <Dropdown
                style={styles.dropDownContainer}
                activeColor={colors.neutral700}
                selectedTextStyle={styles.dropDownSelectedText}
                iconStyle={styles.dropDownIcon}
                data={transactionTypes}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropDownItemText}
                itemContainerStyle={styles.dropDownItemContainer}
                containerStyle={styles.dropDownListContainer}
                value={transaction.type}
                onChange={(item) =>
                  setTransaction({ ...transaction, type: item.value })
                }
              /> */}
              <Picker
                style={{ color: "white" }}
                selectedValue={transaction.type}
                onValueChange={(value, index) =>
                  setTransaction({ ...transaction, type: value })
                }
                dropdownIconColor="white"
                mode="dropdown"
              >
                <Picker.Item
                  label={transactionTypes[0].label}
                  value={transactionTypes[0].value}
                />
                <Picker.Item
                  label={transactionTypes[1].label}
                  value={transactionTypes[1].value}
                />
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>
                Wallet *
              </Typo>
              {/* <Dropdown
                style={styles.dropDownContainer}
                activeColor={colors.neutral700}
                placeholderStyle={styles.dropDownPlaceholder}
                selectedTextStyle={styles.dropDownSelectedText}
                iconStyle={styles.dropDownIcon}
                data={wallets?.map((wallet) => ({
                  label: `${wallet?.name} (Rs ${wallet?.amount})`,
                  value: wallet?.id,
                }))}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropDownItemText}
                itemContainerStyle={styles.dropDownItemContainer}
                containerStyle={styles.dropDownListContainer}
                placeholder={"Select wallet"}
                value={transaction.walletId}
                onChange={(item) =>
                  setTransaction({ ...transaction, walletId: item.value })
                }
              /> */}
              <Picker
                style={{ color: "white" }}
                selectedValue={transaction.walletId}
                onValueChange={(value, index) =>
                  setTransaction({ ...transaction, walletId: value })
                }
                dropdownIconColor="white"
                mode="dropdown"
              >
                {wallets?.map((wallet, index) => (
                  <Picker.Item
                    key={index}
                    label={`${wallet?.name} (Rs ${wallet?.amount})`}
                    value={wallet?.id}
                  />
                ))}
              </Picker>
            </View>
            {transaction.type === "expense" && (
              <View style={styles.inputContainer}>
                <Typo color={colors.neutral200} size={16}>
                  Expense Category *
                </Typo>
                {/* <Dropdown
                  style={styles.dropDownContainer}
                  activeColor={colors.neutral700}
                  placeholderStyle={styles.dropDownPlaceholder}
                  selectedTextStyle={styles.dropDownSelectedText}
                  iconStyle={styles.dropDownIcon}
                  data={Object.values(expenseCategories)}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  itemTextStyle={styles.dropDownItemText}
                  itemContainerStyle={styles.dropDownItemContainer}
                  containerStyle={styles.dropDownListContainer}
                  placeholder={"Select category"}
                  value={transaction.category}
                  onChange={(item) =>
                    setTransaction({ ...transaction, category: item.value })
                  }
                /> */}
                <Picker
                  style={{ color: "white" }}
                  selectedValue={transaction.category}
                  onValueChange={(value, index) =>
                    setTransaction({ ...transaction, category: value })
                  }
                  dropdownIconColor="white"
                  mode="dropdown"
                >
                  {Object.values(expenseCategories)?.map((category, index) => (
                    <Picker.Item
                      key={index}
                      label={category.label}
                      value={category.value}
                    />
                  ))}
                </Picker>
              </View>
            )}
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>
                Date
              </Typo>
              {!showDatePicker ? (
                <Pressable
                  style={({ pressed }) => [
                    pressed && { opacity: 0.75 },
                    styles.dateInput,
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Typo size={14}>
                    {(transaction.date as Date).toLocaleDateString()}
                  </Typo>
                </Pressable>
              ) : (
                <View style={Platform.OS === "ios" && styles.iosDatePicker}>
                  <DateTimePicker
                    themeVariant="dark"
                    value={transaction.date as Date}
                    textColor={colors.white}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                  />
                </View>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>
                Amount *
              </Typo>
              <Input
                keyboardType="numeric"
                value={transaction.amount?.toString()}
                onChangeText={(value) =>
                  setTransaction({
                    ...transaction,
                    amount: Number(value.replace(/[^0-9]/g, "")),
                  })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.flexRow}>
                <Typo color={colors.neutral200} size={16}>
                  Description
                </Typo>
                <Typo color={colors.neutral500} size={14}>
                  (optional)
                </Typo>
              </View>
              <Input
                multiline
                placeholder="Add a description"
                containerStyle={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  height: verticalScale(100),
                }}
                value={transaction.description}
                onChangeText={(value) =>
                  setTransaction({
                    ...transaction,
                    description: value,
                  })
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.flexRow}>
                <Typo color={colors.neutral200} size={16}>
                  Receipt
                </Typo>
                <Typo color={colors.neutral500} size={14}>
                  (optional)
                </Typo>
              </View>
              <ImageUpload
                file={transaction.image}
                onClear={() => setTransaction({ ...transaction, image: null })}
                onSelect={(file) =>
                  setTransaction({ ...transaction, image: file })
                }
                placeholder="Upload Image"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
          <Button
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
            onPress={showDeleteAlert}
          >
            <Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} style={{ flex: 1 }} loading={loading}>
          <Typo color={colors.neutral900} fontWeight="700">
            {oldTransaction?.id ? "Update" : "Submit"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
    backgroundColor: colors.neutral800,
  },
  inputContainer: {
    gap: spacingY._15,
  },
  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  androidDropDown: {
    // flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    // paddingHorizontal: spacingX._15,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {
    // backgroundColor: "red",
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._15,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dropDownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropDownItemText: {
    color: colors.white,
  },
  dropDownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropDownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropDownPlaceholder: {
    color: colors.white,
  },
  dropDownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropDownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
});
