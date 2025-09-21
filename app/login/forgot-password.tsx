import { auth } from "@/config/firebase.config";
import { useFonts } from "expo-font";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {
  const [fontsLoaded] = useFonts({
    "DMSerifText-Regular": require("../../assets/fonts/DMSerifText-Regular.ttf"),
  });

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!fontsLoaded) {
    return null;
  }

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        "Email Sent",
        "A password reset link has been sent to your email address."
      );
    } catch (error: any) {
      console.log("Password reset error:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.wrapper}>
          {/* Header */}
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Please enter your email address. You will receive a link to create a new password via email.
          </Text>

          {/* Input */}
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Enter your email"
            placeholderTextColor="#365486"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Button */}
          <TouchableOpacity
            style={styles.send}
            onPress={handlePasswordReset}
            disabled={isLoading}
          >
            <Text style={styles.sendText}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Text>
          </TouchableOpacity>
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
  wrapper: {
    backgroundColor: "#7FC7D9",
    padding: 25,
    borderRadius: 20,
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontFamily: "DMSerifText-Regular",
    color: "#0F1035",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#365486",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#DCF2F1",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    width: "100%",
    color: "#0F1035",
    marginBottom: 20,
    fontSize: 16,
  },
  send: {
    width: "100%",
    backgroundColor: "#365486",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMSerifText-Regular",
  },
});
