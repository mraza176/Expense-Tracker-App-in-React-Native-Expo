import { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import * as Icons from "phosphor-react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import Button from "@/components/Button";

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleSubmit = () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill all the fields", [{ text: "OK" }], {
        userInterfaceStyle: "dark",
      });
      return;
    }
    console.log({ email: emailRef.current, password: passwordRef.current });
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight="800">
            Hey,
          </Typo>
          <Typo size={30} fontWeight="800">
            Welcome back
          </Typo>
        </View>
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Login now to track all your expenses
          </Typo>
          <Input
            placeholder="Enter your email"
            onChangeText={(text) => (emailRef.current = text)}
            icon={
              <Icons.At size={verticalScale(26)} color={colors.neutral300} />
            }
          />
          <Input
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(text) => (passwordRef.current = text)}
            icon={
              <Icons.Lock size={verticalScale(26)} color={colors.neutral300} />
            }
          />
          <Typo size={14} style={{ alignSelf: "flex-end" }}>
            Forgot Password?
          </Typo>
          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight="700" color={colors.neutral900} size={21}>
              Login
            </Typo>
          </Button>
        </View>
        <View style={styles.footer}>
          <Typo size={15}>Don't have an account?</Typo>
          <Pressable
            onPress={() => router.navigate("/register")}
            style={({ pressed }) => pressed && { opacity: 0.75 }}
          >
            <Typo size={15} fontWeight="700" color={colors.primary}>
              Sign up
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
