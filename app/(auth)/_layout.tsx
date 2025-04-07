import { colors } from "@/constants/theme";
import { JsStack } from "@/layouts/js-stack";
import { View } from "react-native";

const AuthLayout = () => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral900 }}>
      <JsStack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
          gestureResponseDistance: 300,
        }}
      >
        <JsStack.Screen name="welcome" />
        <JsStack.Screen name="login" />
        <JsStack.Screen name="register" />
      </JsStack>
    </View>
  );
};

export default AuthLayout;
