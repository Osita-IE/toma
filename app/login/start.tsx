import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View, } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// 👇 firebase auth
import { auth } from "@/config/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";

export const options = {
  title: "",
};

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    "DMSerifText-Italic": require("../../assets/fonts/DMSerifText-Italic.ttf"),
    "DMSerifText-Regular": require("../../assets/fonts/DMSerifText-Regular.ttf"),
  });

  const router = useRouter();

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter email and password.");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("../tabs"); // redirect after success
    } catch (error: any) {
      console.log("Login error:", error.message);
      Alert.alert("Login Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Log in to track your orders</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor="#365486"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor="#365486"
          />

          <Pressable onPress={() => router.push("../login/forgot-password")}>
            <Text style={styles.forgotText}>Forgot your password?</Text>
          </Pressable>

          <Pressable
            style={styles.signin}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signinText}>Log In</Text>
            )}
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don’t have an account?</Text>
          <Pressable onPress={() => router.push("/login/create-account")}>
            <Text style={styles.signupText}> Sign Up</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCF2F1",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: "DMSerifText-Regular",
    color: "#0F1035",
  },
  subtitle: {
    fontSize: 14,
    color: "#365486",
    marginTop: 5,
    fontFamily: "DMSerifText-Italic",
  },
  form: {
    backgroundColor: "#7FC7D9",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    width: "100%",
    backgroundColor: "#DCF2F1",
    borderRadius: 12,
    marginVertical: 10,
    padding: 15,
    color: "#0F1035",
    fontSize: 16,
  },
  forgotText: {
    color: "#0F1035",
    fontSize: 13,
    marginTop: 10,
    textAlign: "right",
  },
  signin: {
    marginTop: 25,
    backgroundColor: "#365486",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  signinText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "DMSerifText-Regular",
  },
  footer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: "#0F1035",
    fontSize: 14,
  },
  signupText: {
    color: "#365486",
    fontSize: 14,
    fontFamily: "DMSerifText-Italic",
  },
});
