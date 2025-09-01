import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen () {
    return (
        <SafeAreaProvider>
            <ScrollView>
                <View style={style.container}>
                    <View style={style.boxcontainer}>
                        <View style={style.box}>
                            <Image
                            style={{width: 80, height: 80, marginTop: 10,marginBottom: 10}}
                            source={require ("../../assets/images/user.png")}
                            />
                            <Text style={{color: "#ffff"}}>Name</Text>
                            <View style={style.details}>
                                <View style={style.icons}> 
                                    <MaterialCommunityIcons 
                                    name="card-account-details-outline" 
                                    size={20} 
                                    color="#1A1A2E" />
                                </View>
                                <View style={style.icons}>
                                    <FontAwesome 
                                    name="history" 
                                    size={20} 
                                    color="#1A1A2E" />
                                </View>
                                <View style={style.icons}>
                                    <Pressable
                                            onPress={() => router.push("/tabs/measurements")}
                                    >
                                        <FontAwesome5 
                                    name="pencil-ruler" 
                                    size={20} 
                                    color="#1A1A2E" />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                        <View style={style.box}>
                            <Image
                            style={{width: 80, height: 80, marginTop: 5}}
                            source={require ("../../assets/images/user.png")}
                            />
                            <Text style={{color: "#ffff"}}>Name</Text>
                            <View style={style.details}>
                                <View style={style.icons}> 
                                    <MaterialCommunityIcons 
                                    name="card-account-details-outline" 
                                    size={20} 
                                    color="#1A1A2E" />
                                </View>
                                <View style={style.icons}>
                                    <FontAwesome 
                                    name="history" 
                                    size={20} 
                                    color="#1A1A2E" />
                                </View>
                                <View style={style.icons}>
                                    <Pressable
                                            onPress={() => router.push("/tabs/measurements")}
                                    >
                                        <FontAwesome5 
                                    name="pencil-ruler" 
                                    size={20} 
                                    color="#1A1A2E" />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                        <View style={style.box}>
                            <Image
                            style={{width: 80, height: 80, marginTop: 5}}
                            source={require ("../../assets/images/user.png")}
                            />
                            <Text style={{color: "#ffff"}}>Name</Text>
                            <View style={style.details}>
                                <View style={style.icons}> 
                                    <MaterialCommunityIcons 
                                    name="card-account-details-outline" 
                                    size={20} 
                                    color="#1A1A2E" />
                                </View>
                                <View style={style.icons}>
                                    <FontAwesome 
                                    name="history" 
                                    size={20} 
                                    color="#1A1A2E" />
                                </View>
                                <View style={style.icons}>
                                    <Pressable
                                            onPress={() => router.push("/tabs/measurements")}
                                    >
                                        <FontAwesome5 
                                    name="pencil-ruler" 
                                    size={20} 
                                    color="#1A1A2E" />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                        <View style={style.box}>
                            <Image
                            style={{width: 80, height: 80, marginTop: 5}}
                            source={require ("../../assets/images/user.png")}
                            />
                            <Text style={{color: "#ffff"}}>Name</Text>
                            <View style={style.details}>
                                <View style={style.icons}> 
                                    <MaterialCommunityIcons 
                                    name="card-account-details-outline" 
                                    size={20} 
                                    color="#1A1A2E" />
                                </View>
                                <View style={style.icons}>
                                    <FontAwesome 
                                    name="history" 
                                    size={20} 
                                    color="#1A1A2E" />
                                </View>
                                <View style={style.icons}>
                                    <Pressable
                                            onPress={() => router.push("/tabs/measurements")}
                                    >
                                        <FontAwesome5 
                                    name="pencil-ruler" 
                                    size={20} 
                                    color="#1A1A2E" />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
};

const style = StyleSheet.create ({
    container: {
        display: "flex",
        alignItems: "center",
        paddingVertical: 30,
        backgroundColor: "#ececdaff"
    },
    boxcontainer: {
        display: "flex",
        gap: 20
    },
    box: {
        display: "flex",
        height: 200,
        width: 400,
        borderRadius: 25,
        backgroundColor: "#a8a5a5ff",
        alignItems: "center"
    },
    details: {
        flexDirection: "row",
        gap: 40,
        marginVertical: 30
    },
    icons: {
        height: 30,
        width: 60,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#d9daeeff",
        
    },
});