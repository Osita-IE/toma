import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const options = {
  title: '',
};

export default function index () {
  const [fontsLoaded] = useFonts({
    'DMSerifText-Italic': require('../assets/fonts/DMSerifText-Italic.ttf'),
    'DMSerifText-Regular': require('../assets/fonts/DMSerifText-Regular.ttf'),
  });


  const [text, onChangeText] = useState("");
  const [password, setPassword] = useState("");
  const image = require ("../assets/images/emmanuel-boldo-3FUXXzpNx3o-unsplash.jpg");
  
  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{display: "flex", flexDirection: "column", flex: 1}}>
    <ImageBackground source={image} resizeMode="stretch" style={styles.image}>
    <View style={styles.overlay} pointerEvents="none" />
    <View style={styles.headertext}>
      <Text style={{
        color: "#9CAFAA",
        fontSize: 100,
        fontFamily: "DMSerifText-Regular"
      }}>Hello</Text>
      <Text style={{
        fontFamily: "DMSerifText-Italic",
        color: "#9CAFAA"
      }}>Sign in to your account</Text>
    </View>

    <View style={styles.box}>
      <TextInput 
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
        placeholder="password"
        keyboardType="numeric"
      />
      <Text>Forgot your password?</Text>
    </View>

    <View>
      <Text style={styles.signin}>Sign In 
        <View style={styles.pointer}></View> 
      </Text>
    </View>
  </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create ({
    overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)', // Change 0.3 to your desired opacity
    zIndex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
  },
  headertext: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 30
  },
  box: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 300,
    marginTop: 100,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: "#D6DAC8",
    borderRadius: 20
  },
  input: {
    width: 250,
    backgroundColor: "#FBF3D5",
    borderRadius: 50,
    margin: 10,
    padding: 20,
  },
  signin: {
    margin: 40,
    padding: 20,
    width: 200,
    textAlign: "center",
    alignSelf: "center",
    borderRadius: 20,
    fontFamily: "DMSerifText-Italic",
    backgroundColor: "#ffff"
  },
  pointer: {
    backgroundColor: "#064232",
    color: "#064232"
  },
});