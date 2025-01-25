import { Pressable, StyleSheet, View } from "react-native";
import { CustomButtonProps } from "@/types";
import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Loading from "./Loading";

const Button = ({
  style,
  onPress,
  loading = false,
  children,
}: CustomButtonProps) => {
  return loading ? (
    <View style={[styles.button, style, { backgroundColor: "transparent" }]}>
      <Loading />
    </View>
  ) : (
    <Pressable
      style={({ pressed }) => [
        pressed && { opacity: 0.75 },
        styles.button,
        style,
      ]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius._17,
    borderCurve: "continuous",
    height: verticalScale(52),
    justifyContent: "center",
    alignItems: "center",
  },
});
