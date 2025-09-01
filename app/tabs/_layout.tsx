import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from "expo-router";

const themeColors = {
  tabBarActiveTintColor: "#a8a5a5ff",
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
                color="#1A1A2E" />
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
                color="#1A1A2E"/>
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
                color="#1A1A2E" />
            }} />
        </Tabs>
    );
};