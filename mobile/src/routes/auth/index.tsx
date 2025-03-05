import { AuthLayout } from "@/layouts/auth";
import { SignIn } from "@/screens/sign-in";
import { SignUp } from "@/screens/sign-up";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function SignInWithLayout() {
  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
}

function SignUpWithLayout() {
  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
}

export function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signIn" component={SignInWithLayout} />
      <Stack.Screen name="signUp" component={SignUpWithLayout} />
    </Stack.Navigator>
  );
}
