import { StyleSheet } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import Button from "@/components/Button";
import { colors } from "@/constants/theme";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";

const HomeScreen = () => {
  const handleLogout = async () => {
    await signOut(auth);
  };
  return (
    <ScreenWrapper>
      <Button onPress={handleLogout}>
        <Typo color={colors.neutral900}>Logout</Typo>
      </Button>
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
