import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { UploadSimple, XCircle } from "phosphor-react-native";
import { ImageUploadProps } from "@/types";
import { colors, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { getFilePath } from "@/services/imageService";
import * as ImagePicker from "expo-image-picker";
import Typo from "./Typo";

const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = "",
}: ImageUploadProps) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onSelect(result.assets[0]);
    }
  };
  return (
    <View>
      {!file && (
        <Pressable
          style={({ pressed }) => [
            pressed && { opacity: 0.75 },
            styles.inputContainer,
            containerStyle && containerStyle,
          ]}
          onPress={pickImage}
        >
          <UploadSimple color={colors.neutral200} />
          {placeholder && <Typo size={15}>{placeholder}</Typo>}
        </Pressable>
      )}
      {file && (
        <View style={[styles.image, imageStyle && imageStyle]}>
          <Image
            style={{ flex: 1 }}
            source={getFilePath(file)}
            contentFit="cover"
            transition={100}
          />
          <Pressable
            style={({ pressed }) => [
              pressed && { opacity: 0.75 },
              styles.deleteIcon,
            ]}
            onPress={onClear}
          >
            <XCircle
              size={verticalScale(24)}
              weight="fill"
              color={colors.white}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  inputContainer: {
    height: verticalScale(54),
    backgroundColor: colors.neutral700,
    borderRadius: radius._15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderStyle: "dashed",
  },
  image: {
    height: scale(150),
    width: scale(150),
    borderRadius: radius._15,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  deleteIcon: {
    position: "absolute",
    top: scale(6),
    right: scale(6),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
  },
});
