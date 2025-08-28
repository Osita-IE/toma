import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const options = {
  title: '',
};

export default function index () {
  const [fontsLoaded] = useFonts({
    'DMSerifText-Italic': require('../../assets/fonts/DMSerifText-Italic.ttf'),
    'DMSerifText-Regular': require('../../assets/fonts/DMSerifText-Regular.ttf'),
  });


  const router = useRouter();
  const [text, onChangeText] = useState("");
  const [password, setPassword] = useState("");
  const image = require ("../../assets/images/diana-polekhina-iUfusOthmgQ-unsplash.jpg");
  
  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{display: "flex", flexDirection: "column", flex: 1}}>
    {/* <ImageBackground source={image} blurRadius={3} resizeMode="cover" style={styles.image}> */}
    {/* <View style={styles.overlay} pointerEvents="none" /> */}
    <View style={styles.headertext}>
      <Text style={{
        color: "#000",
        fontSize: 80,
        fontFamily: "DMSerifText-Regular"
      }}>TOMA</Text>
      <Text style={{
        color: "#000",
        fontSize: 10,
        fontFamily: "DMSerifText-Regular"
      }}>tailor order manager app</Text>
    </View>

      
    <View style={styles.box}>
      <TextInput 
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Email"
        placeholderTextColor={"#000"}
      />
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
        placeholder="password"
        placeholderTextColor={"#000"}
        keyboardType="numeric"
      />
      <Text style={{color: "#ffff", marginTop: 20}}>Forgot your password?</Text>
    </View>

    <View>
      <Pressable
      style={styles.signin}
      onPress={() => router.push("../tabs")}
      >
        <TouchableOpacity>
      <Text style={{ textAlign: "center", color: "#ffff", fontSize: 20, fontFamily: "DMSerifText-Italic" }}>Log In</Text>
        </TouchableOpacity>
    </Pressable>
    {/* <Text style={{display: "flex", textAlign: "center", color: "#EAD9C6", fontSize: 15, marginTop: 100}}>Already have an account? Log In</Text> */}
    </View>

      <View style={styles.createaccount}>
        <Pressable
      onPress={() => router.push("/login/create-account")}
      >
        <Text style={{color: "#000", fontSize: 15, fontFamily: "DMSerifText-Italic"}}>Create Account</Text>
        </Pressable>
      </View>

  {/* </ImageBackground> */}
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
    marginTop: 50,
  },
  box: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 300,
    marginTop: 150,
    marginHorizontal: 30,
    padding: 20,
    backgroundColor: "#000000d0",
    borderRadius: 20,
  },
  input: {
    width: 250,
    backgroundColor: "#ffff",
    borderRadius: 50,
    margin: 10,
    padding: 20
  },
  signin: {
    margin: 40,
    padding: 20,
    width: 200,
    textAlign: "center",
    alignSelf: "center",
    borderRadius: 50,
    fontFamily: "DMSerifText-Italic",
    backgroundColor: "#000000d0"
  },
  createaccount: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});