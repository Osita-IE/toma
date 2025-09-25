import { Stack } from "expo-router";

export default function _Layout() {
  return(
    <Stack>
      <Stack.Screen name="index"options={{headerShown:false}}/>
      <Stack.Screen name="(login)/start"options={{headerShown:false}}/>
      <Stack.Screen name="(login)/forgot-password"options={{headerShown:false}}/>
      <Stack.Screen name="(login)/create-account"options={{headerShown:false}}/>
      <Stack.Screen name="choose-screen"options={{headerShown:false}}/>
      <Stack.Screen name="(tabs)"options={{headerShown:false}}/>
    </Stack>
  );
}
