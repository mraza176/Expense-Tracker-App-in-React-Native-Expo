import { Stack } from "expo-router";

const ModalLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profileModal" options={{ presentation: "modal" }} />
    </Stack>
  );
};

export default ModalLayout;
