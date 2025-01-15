import { JsStack } from "@/layouts/js-stack";

const AuthLayout = () => {
  return (
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
  );
};

export default AuthLayout;
