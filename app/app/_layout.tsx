import "../global.css";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerShadowVisible: false,
          headerTintColor: '#1f2937',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'FluxNotes',
            headerLargeTitle: false,
          }}
        />
        <Stack.Screen
          name="note/[id]"
          options={{
            title: 'Note',
            presentation: 'card',
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </>
  );
}