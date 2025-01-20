import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

export default TabsLayout;
