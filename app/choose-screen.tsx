import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function IntroScreen() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      {/* ImageBackground allows you to set a background image */}
      <ImageBackground
        source={require("../assets/images/emmanuel-boldo-3FUXXzpNx3o-unsplash.jpg")} // <-- Replace with your image path
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.iconWrapper}>
            <FontAwesome6 name="scissors" size={24} color="black" />
          </View>
          {/* App Title */}
          <Text style={styles.title}>Welcome to TOMA</Text>

          {/* Description of app */}
          <Text style={styles.description}>
            A tailor order management application. TOMA helps tailors manage their clients efficiently. You can:
            {"\n\n"}
            • Record client details and measurements.{"\n"}
            • Track orders with a progress bar.{"\n"}
            • Record fabrics, colors, designs, and deadlines.{"\n"}
            • Send updates to clients in real-time.{"\n"}
            • Keep all client data organized in one place.
          </Text>

          {/* Button to enter app */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.roleButton, { backgroundColor: "#365486" }]}
              onPress={() => router.push("../(tabs)/clients")}
            >
              <Text style={styles.buttonText}>Start Your Tailoring Journey</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(220, 242, 241, 0.85)", // semi-transparent overlay for readability
  },
  iconWrapper: {
    backgroundColor: "#7FC7D9",
    padding: 20,
    borderRadius: 100,
    marginVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F1035",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#365486",
    textAlign: "center",
    marginBottom: 60,
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  roleButton: {
    width: "80%",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});
