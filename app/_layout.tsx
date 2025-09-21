import { Stack } from "expo-router";

export default function RootLayout() {
  return(
    <Stack>
      <Stack.Screen 
      name="index"
      options={{
        headerShown:false,
      }}/>
      <Stack.Screen 
      name="login/start"
      options={{
        headerShown:false,
      }}/>
      <Stack.Screen 
      name="login/forgot-password"
      options={{
        headerShown:false,
      }}/>
      <Stack.Screen 
      name="login/create-account"
      options={{
        headerShown:false,
      }}/>
      <Stack.Screen 
      name="tabs"
      options={{
        headerShown:false,
      }}/>
      <Stack.Screen 
      name="orders"
      options={{
        headerShown:false,
      }}/>
      <Stack.Screen 
      name="clients"
      options={{
        headerShown:false,
      }}/>
      <Stack.Screen 
      name="measurements"
      options={{
        headerShown:false,
      }}/>
      <Stack.Screen name="history"
      options={{
        headerShown: false 
      }}/>
    </Stack>
  );
}
