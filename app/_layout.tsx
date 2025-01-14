import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarBackgroundColor: "transparent",
        navigationBarTranslucent: true,
        navigationBarColor: "transparent",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/welcome" />
    </Stack>
  );
};

export default RootLayout;
