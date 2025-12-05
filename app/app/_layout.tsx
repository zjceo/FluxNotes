import "../global.css";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, useColorScheme } from 'react-native';

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
          },
          headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#111827' : '#f3f4f6',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'FluxNotes',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="note/[id]"
          options={{
            title: 'Edit Note',
            presentation: 'modal',
          }}
        />
      </Stack>
    </View>
  );
}
