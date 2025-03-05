import { Button } from "@/components/button";
import { ChevronLeft } from "@/components/icons/left";
import { Input } from "@/components/input";
import { api } from "@/libs/axios";
import { useAuth } from "@/providers/auth";
import { NavigationRoutes } from "@/routes";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";

type SignUpForm = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export function SignUp() {
  const { login, setUser } = useAuth();
  const navigation = useNavigation<NavigationRoutes>();

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<SignUpForm>({
    defaultValues: { name: "", email: "", password: "", passwordConfirm: "" },
  });

  const onSubmit = async ({ name, email, password, passwordConfirm }: SignUpForm) => {
    if (!name || !email || !password || !passwordConfirm) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      console.log("Iniciando cadastro...");
      await api.post("users", { name, email, password });

      console.log("Cadastro realizado. Tentando login...");
      const { data: token } = await api.post("sessions", { email, password });

      if (!token) {
        Alert.alert("Erro", "Token não recebido. Verifique as credenciais.");
        return;
      }

      console.log("Token recebido:", token);
      await login(token);

      console.log("Buscando informações do usuário...");
      const { data: user } = await api.get("me");
      await setUser(user);

      console.log("Usuário logado! Navegando para Home...");
      reset();
      navigation.navigate("workouts");
    } catch (error: any) {
      console.error("Erro ao cadastrar ou logar:", error);
      Alert.alert("Erro", error.response?.data?.message || "Não foi possível cadastrar.");
    }
  };

  return (
    <View className="w-72 gap-2">
      <Controller
        name="name"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            placeholder="Nome"
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            placeholder="Senha"
            secureTextEntry
          />
        )}
      />
      <Controller
        name="passwordConfirm"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            placeholder="Confirmar a senha"
            secureTextEntry
          />
        )}
      />
      <View className="flex-row justify-between">
        <Button label="Voltar" variant="secondary" className="w-28" icon={ChevronLeft} onPress={() => navigation.navigate("signIn")} />
        <Button label={isSubmitting ? "" : "Cadastrar"} className="w-28" onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
}
