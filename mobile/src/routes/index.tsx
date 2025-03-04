import { useAuth } from "@/providers/auth";
import { NavigationContainer } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { AppRoutes } from "./app";
import { AuthRoutes } from "./auth";

export type RoutesProps = {
  signIn: undefined;
  signUp: undefined;
  workouts: undefined;
  workout: { id: string };
  profile: undefined;
};

export type NavigationRoutes = NativeStackNavigationProp<RoutesProps>;

export function Routes() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
