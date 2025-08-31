import { useFonts } from "expo-font";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index () {
    // const router = useRouter();

    const [fontsLoaded] = useFonts ({
        'DMSerifText-Regular': require('../../assets/fonts/DMSerifText-Regular.ttf'),
    });

    const [text, onChangeText] = useState("");

    if (!fontsLoaded) {
        return true;
    }


    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                    <View style={styles.centertext}>
                        <Text style={{fontFamily: "DMSerifText-Regular", fontSize: 50, color: "#1A1A2E"}}>Forgot Password</Text>
                        <Text>Please enter your email address. You 
                            will receive a link to create a new 
                            password via email</Text>

                        <TextInput 
                            style={styles.input}
                            onChangeText={onChangeText}
                            value={text}
                            placeholder="email"
                            placeholderTextColor={"#ffff"}
                        />
                        <TouchableOpacity style={styles.send}>
                            <Text style={{color: "white", textAlign: "center"}}>SEND</Text>
                        </TouchableOpacity>
                    </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
};

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        alignItems: "center",
        marginTop: 100,
    },
    centertext: {
        alignSelf: "center",
        paddingHorizontal: 20,
        gap: 15
    },
    input: {
        backgroundColor: "#a8a5a5ff",
        borderRadius: 5,
        marginTop: 30
    },
    send: {
        width: 200,
        alignSelf: "center",
        backgroundColor: "#1A1A2E",
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
});