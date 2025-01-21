import { JsTabs } from "@/layouts/js-tabs";
import { ChartBar, House, User, Wallet } from "phosphor-react-native";
import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

const TabsLayout = () => {
  return (
    <JsTabs
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.neutral800,
          height: verticalScale(75),
          borderTopWidth: 1,
          borderTopColor: colors.neutral700,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.neutral400,
        tabBarShowLabel: false,
        tabBarIndicator: () => null,
      }}
    >
      <JsTabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <House
              size={verticalScale(30)}
              weight={focused ? "fill" : "regular"}
              color={color}
            />
          ),
        }}
      />
      <JsTabs.Screen
        name="statistics"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ChartBar
              size={verticalScale(30)}
              weight={focused ? "fill" : "regular"}
              color={color}
            />
          ),
        }}
      />
      <JsTabs.Screen
        name="wallet"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Wallet
              size={verticalScale(30)}
              weight={focused ? "fill" : "regular"}
              color={color}
            />
          ),
        }}
      />
      <JsTabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <User
              size={verticalScale(30)}
              weight={focused ? "fill" : "regular"}
              color={color}
            />
          ),
        }}
      />
    </JsTabs>
  );
};

export default TabsLayout;
