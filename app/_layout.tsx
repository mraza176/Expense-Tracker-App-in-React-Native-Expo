import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/authContext";

const RootLayout = () => {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
};

export default RootLayout;
