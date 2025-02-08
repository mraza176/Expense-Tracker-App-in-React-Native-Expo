import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { CaretRight } from "phosphor-react-native";
import { WalletType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import Animated, { FadeInDown } from "react-native-reanimated";
import Typo from "./Typo";

const WalletListItem = ({
  item,
  index,
}: {
  item: WalletType;
  index: number;
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(13)}
    >
      <Pressable
        style={({ pressed }) => [
          pressed && { opacity: 0.75 },
          styles.container,
        ]}
        onPress={() =>
          router.push({
            pathname: "/(modals)/walletModal",
            params: { id: item?.id, name: item?.name, image: item?.image },
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image
            style={{ flex: 1 }}
            source={item.image}
            contentFit="cover"
            transition={100}
          />
        </View>
        <View style={styles.nameContainer}>
          <Typo size={16}>{item?.name}</Typo>
          <Typo size={14} color={colors.neutral400}>
            Rs {item?.amount}
          </Typo>
        </View>
        <CaretRight
          size={verticalScale(20)}
          weight="bold"
          color={colors.white}
        />
      </Pressable>
    </Animated.View>
  );
};

export default WalletListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(17),
    // padding: spacingX._15,
  },
  imageContainer: {
    height: verticalScale(45),
    width: verticalScale(45),
    borderWidth: 1,
    borderColor: colors.neutral600,
    borderRadius: radius._12,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  nameContainer: {
    flex: 1,
    gap: 2,
    marginLeft: spacingX._10,
  },
});
