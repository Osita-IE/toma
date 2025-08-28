import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const options = {
  title: '',
};

export default function index () {
  const [fontsLoaded] = useFonts({
    'DMSerifText-Italic': require('../assets/fonts/DMSerifText-Italic.ttf'),
    'DMSerifText-Regular': require('../assets/fonts/DMSerifText-Regular.ttf'),
  });


  const router = useRouter();
  const [text, onChangeText] = useState("");
  const [password, setPassword] = useState("");
  const image = require ("../assets/images/measuring-2923809.jpg");
  
  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{display: "flex", flexDirection: "column", flex: 1}}>
    <ImageBackground source={image} resizeMode="cover" blurRadius={7} style={styles.image}>
    <View style={styles.overlay} pointerEvents="none" />
      <View style={styles.centercontainer}>
        <View style={styles.headertext}>
        <Text style={{
            color: "#ffff",
            fontSize: 60,
            fontFamily: "DMSerifText-Regular"
        }}>Welcome!</Text>
        </View>

        <View>
        <Pressable
        style={styles.signin}
        onPress={() => router.push("/login/start")}
        >
          <TouchableOpacity>
            <Text style={{ textAlign: "center", color: "#9c8d08ff", fontSize: 25, fontFamily: "DMSerifText-Italic" }}>Get Started</Text>
          </TouchableOpacity>
        </Pressable>
      </View>
    </View>
  </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create ({
    overlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', // Change 0.3 to your desired opacity
    zIndex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
  },
  centercontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2
  },
  headertext: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 20
  },
  signin: {
    padding: 15,
    width: 200,
    textAlign: "center",
    alignSelf: "center",
    borderRadius: 20,
    fontFamily: "DMSerifText-Italic",
    backgroundColor: "#ffff"
  },
});