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
          <View>
            <View style={styles.create}>
                <Text style={{fontSize: 30, fontFamily: "DMSerifText-Regular.ttf" }}>Create Account</Text>
            </View>
            <TextInput 
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                placeholder="name"
                placeholderTextColor={"#ffff"}
                />
            <TextInput 
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                placeholder="email"
                placeholderTextColor={"#ffff"}
                />
            <TextInput
                style={styles.input}
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
                placeholder="password"
                placeholderTextColor={"#ffff"}
                keyboardType="numeric"
            />
            <Pressable
            onPress={() => router.push("../login/start")}
            >
                <View style={styles.signup}>
                <Text style={{color: "#ffff"}}>Sign Up</Text>
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
  input: {
    backgroundColor: "#000",
    width: 300,
    height: 50,
    paddingLeft: 20,
    margin: 20,
    borderRadius: 30,
  },
  signup: {
    backgroundColor: "#000",
    width: 300,
    height: 50,
    paddingLeft: 20,
    margin: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
});
