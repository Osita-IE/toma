import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const options = {
  title: "",
};

export default function Index() {
  const [fontsLoaded] = useFonts({
    "DMSerifText-Italic": require("../assets/fonts/DMSerifText-Italic.ttf"),
    "DMSerifText-Regular": require("../assets/fonts/DMSerifText-Regular.ttf"),
  });

  const router = useRouter();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Logo / Icon */}
        <View style={styles.iconWrapper}>
          <FontAwesome6 name="scissors" size={24} color="black" />
        </View>

        {/* Title & Tagline */}
        <View style={styles.textWrapper}>
          <Text style={styles.title}>Tailor Order Tracker</Text>
          <Text style={styles.tagline}>
            “Log In. Stay Sharp. Track Seamlessly.”
          </Text>
        </View>

        {/* Get Started Button */}
        <Pressable
          style={styles.getStartedBtn}
          onPress={() => router.push("/(login)/start")}
        >
          <Text style={styles.btnText}>Get Started</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCF2F1", // main background
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 80,
  },
  iconWrapper: {
    backgroundColor: "#7FC7D9",
    padding: 20,
    borderRadius: 100,
    marginTop: 40,
  },
  textWrapper: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: "DMSerifText-Regular",
    color: "#0F1035",
    textAlign: "center",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "DMSerifText-Italic",
    color: "#365486",
    textAlign: "center",
  },
  getStartedBtn: {
    backgroundColor: "#365486",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 50,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "DMSerifText-Regular",
  },
});
