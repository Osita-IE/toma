import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

    const [fontsLoaded] = useFonts({
    'DMSerifText-Italic': require('../../assets/fonts/DMSerifText-Italic.ttf'),
    'DMSerifText-Regular': require('../../assets/fonts/DMSerifText-Regular.ttf'),
    });

    const [text, onChangeText] = useState("");
    const [password, setPassword] = useState("");
    const image = require ("../../assets/images/diana-polekhina-iUfusOthmgQ-unsplash.jpg");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
          <View style={styles.box}>
            <View style={styles.create}>
                <Text style={{color: "#1A1A2E", fontSize: 30, fontFamily: "DMSerifText-Regular" }}>Create Account</Text>
            </View>
            <TextInput 
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                placeholder="name"
                placeholderTextColor={"#a8a5a5ff"}
                />
            <TextInput 
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                placeholder="email"
                placeholderTextColor={"#a8a5a5ff"}
                />
            <TextInput
                style={styles.input}
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
                placeholder="password"
                placeholderTextColor={"#a8a5a5ff"}
                keyboardType="numeric"
            />
            <Pressable
            onPress={() => router.push("../login/start")}
            >
                <View style={styles.signup}>
                <Text style={{color: "#FFFFF0"}}>Sign Up</Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff"
  },
  create: {
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    display: "flex",
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "none",
    height: "50%",
    width: "80%",
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#1A1A2E"
  },
  input: {
    backgroundColor: "#1A1A2E",
    width: 300,
    height: 50,
    paddingLeft: 20,
    margin: 20,
    borderRadius: 30,
  },
  signup: {
    backgroundColor: "#1A1A2E",
    width: 300,
    height: 50,
    paddingLeft: 20,
    marginTop: 50,
    margin: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
});
