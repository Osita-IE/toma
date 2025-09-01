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
                
          <View style={styles.headertext}>
            <Text style={{
              color: "#1A1A2E",
              fontSize: 80,
              fontFamily: "DMSerifText-Regular"
            }}>TOMA</Text>
            <Text style={{
              color: "#a8a5a5ff",
              fontSize: 10,
              fontFamily: "DMSerifText-Regular",
              fontStyle: "italic"
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
            <Pressable
            onPress={() => router.push("../login/forgot-password")}
            >
            <Text style={{color: "#ffff", marginTop: 20}}>Forgot your password?</Text>
            </Pressable>
          </View>

          <View>
            <Pressable
            style={styles.signin}
            onPress={() => router.push("../tabs")}
            >
              <TouchableOpacity>
            <Text style={{ textAlign: "center", color: "#d9daeeff", fontSize: 20, fontFamily: "DMSerifText-Italic" }}>Log In</Text>
              </TouchableOpacity>
          </Pressable>
          </View>

            <View style={styles.createaccount}>
              <Pressable
            onPress={() => router.push("/login/create-account")}
            >
              <Text style={{color: "#1A1A2E", fontSize: 15, fontFamily: "DMSerifText-Italic"}}>Create Account</Text>
              </Pressable>
        </View>
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
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
  },
  input: {
    width: 250,
    backgroundColor: "#d9daeeff",
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
    backgroundColor: "#1A1A2E"
  },
  createaccount: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});