import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/authContext";
import { View } from "react-native";
import { colors } from "@/constants/theme";

const RootLayout = () => {
  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: colors.neutral900 }}>
        <Stack
          screenOptions={{
            animation: "slide_from_right",
            headerShown: false,
            statusBarBackgroundColor: "transparent",
            navigationBarTranslucent: true,
            navigationBarColor: "transparent",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(modals)" />
        </Stack>
      </View>
    </AuthProvider>
  );
};

export default RootLayout;
