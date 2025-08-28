import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from "expo-router";

const themeColors = {
  tabBarActiveTintColor: "#000",
};

export default function _layout () {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: themeColors.tabBarActiveTintColor
        }}>
            <Tabs.Screen
                name="clients"
                options={{
                title: "Clients",
                headerShown: true,
                tabBarIcon: ({ color }) =>
                <FontAwesome5 
                name="users" 
                size={24} 
                color="#000" />
            }} />

            <Tabs.Screen
                name="orders"
                options={{
                title: "Orders",
                headerShown: true,
                tabBarIcon: ({ color }) =>
                <FontAwesome5
                name="list-ul" 
                size={24} 
                color="#000"/>
            }} />

            <Tabs.Screen
                name="measurements"
                options={{
                title: "Measurements",
                headerShown: true,
                tabBarIcon: ({ color }) =>
                <FontAwesome5 
                name="pencil-ruler" 
                size={24} 
                color="#000" />
            }} />
        </Tabs>
    );
};