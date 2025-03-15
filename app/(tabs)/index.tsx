import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { MagnifyingGlass, Plus } from "phosphor-react-native";
import { limit, orderBy, where } from "firebase/firestore";
import { useAuth } from "@/contexts/authContext";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import HomeCard from "@/components/HomeCard";
import TransactionList from "@/components/TransactionList";
import Button from "@/components/Button";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";

const HomeScreen = () => {
  const { user } = useAuth();

  const {
    data: recentTransactions,
    loading,
    error,
  } = useFetchData<TransactionType>("transactions", [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30),
  ]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo size={20} fontWeight="500">
              {user?.name || "-----"}
            </Typo>
          </View>
          <Pressable
            style={({ pressed }) => [
              pressed && { opacity: 0.75 },
              styles.searchIcon,
            ]}
          >
            <MagnifyingGlass
              size={verticalScale(22)}
              color={colors.neutral200}
              weight="bold"
            />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <HomeCard />
          </View>
          <TransactionList
            data={recentTransactions}
            loading={loading}
            emptyListMessage="No Transactions Added Yet!"
            title="Recent Transactions"
          />
        </ScrollView>
        <Button
          style={styles.floatingButton}
          onPress={() => router.push("/(modals)/transactionModal")}
        >
          <Plus color={colors.black} weight="bold" size={verticalScale(24)} />
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
