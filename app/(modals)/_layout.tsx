import { Stack } from "expo-router";

const ModalLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: "modal" }}>
      <Stack.Screen name="profileModal" />
      <Stack.Screen name="walletModal" />
    </Stack>
  );
};

export default ModalLayout;
