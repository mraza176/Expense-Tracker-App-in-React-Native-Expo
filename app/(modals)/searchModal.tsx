import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { orderBy, where } from "firebase/firestore";
import { colors, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { TransactionType } from "@/types";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import TransactionList from "@/components/TransactionList";
import useFetchData from "@/hooks/useFetchData";

const SearchModal = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const {
    data: allTransactions,
    loading,
    error,
  } = useFetchData<TransactionType>("transactions", [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
  ]);

  const filteredTransactions = allTransactions.filter((item) => {
    if (search.length > 1) {
      if (
        item.category?.toLowerCase().includes(search.toLowerCase()) ||
        item.type?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      ) {
        return true;
      }
      return false;
    }
    return true;
  });

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title="Search"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Search..."
              placeholderTextColor={colors.neutral400}
              containerStyle={{ backgroundColor: colors.neutral800 }}
              value={search}
              onChangeText={(value) => setSearch(value)}
            />
          </View>
          <View>
            <TransactionList
              loading={loading}
              data={filteredTransactions}
              emptyListMessage="No transactions match your search!"
            />
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
    // paddingVertical: spacingY._30,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
