import { Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import { BackButtonProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";

const BackButton = ({ style, iconSize = 26 }: BackButtonProps) => {
  return (
    <Pressable
      onPress={router.back}
      style={({ pressed }) => [
        pressed && { opacity: 0.75 },
        styles.button,
        style,
      ]}
    >
      <CaretLeft
        size={verticalScale(iconSize)}
        color={colors.white}
        weight="bold"
      />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.neutral600,
    alignSelf: "flex-start",
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5,
  },
});
