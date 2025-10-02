import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

const themeColors = {
  background: "#DCF2F1",
  tabBarActiveTintColor: "#365486",
  tabBarInactiveTintColor: "#7FC7D9",
  headerBackground: "#7FC7D9",
  headerTint: "#0F1035",
  iconColor: "#0F1035",
};

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tabBarActiveTintColor,
        tabBarInactiveTintColor: themeColors.tabBarInactiveTintColor,
        tabBarStyle: { backgroundColor: themeColors.background },
        headerStyle: { backgroundColor: themeColors.headerBackground },
        headerTintColor: themeColors.headerTint,
        tabBarLabelStyle: { fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="clients"
        options={{
          title: "Clients",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="users" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="shirt-sharp" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="history" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-alt" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
