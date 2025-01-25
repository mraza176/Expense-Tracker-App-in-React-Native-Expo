import { ParamListBase, StackNavigationState } from "@react-navigation/native";

import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";

import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();

export const JsTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);
