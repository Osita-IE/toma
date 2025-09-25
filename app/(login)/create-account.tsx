import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// 👇 firebase imports
import { auth } from "@/config/firebase.config";
import { useFonts } from "expo-font";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function CreateAccount() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "DMSerifText-Italic": require("../../assets/fonts/DMSerifText-Italic.ttf"),
    "DMSerifText-Regular": require("../../assets/fonts/DMSerifText-Regular.ttf"),
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      // save displayName
      await updateProfile(user, { displayName: name });

      Alert.alert("Success", "Account created! Please log in.");
      router.push("../login/start"); // 👈 navigate to login page
    } catch (error: any) {
      console.log("Signup error:", error.message);
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Full Name"
            placeholderTextColor="#365486"
          />
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

          <Pressable onPress={handleSignUp} disabled={isLoading}>
            <View style={styles.signupBtn}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signupText}>Sign Up</Text>
              )}
            </View>
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
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#7FC7D9",
    width: "100%",
    maxWidth: 350,
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: "DMSerifText-Regular",
    color: "#0F1035",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#DCF2F1",
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#0F1035",
  },
  signupBtn: {
    backgroundColor: "#365486",
    width: 200,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  signupText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMSerifText-Regular",
  },
});
