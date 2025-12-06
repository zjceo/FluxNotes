import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, Text } from 'react-native';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#6366f1',
        drawerInactiveTintColor: '#4b5563',
        drawerLabelStyle: {
            marginLeft: -20,
            fontSize: 15,
            fontWeight: '600',
        },
      }}>
        <Drawer.Screen
            name="index" // This is the home route
            options={{
                drawerLabel: 'Inicio',
                title: 'Inicio',
                drawerIcon: ({ color }) => <Text style={{fontSize: 22, color}}>📝</Text>
            }}
        />
        <Drawer.Screen
            name="favorites" 
            options={{
                drawerLabel: 'Favoritos',
                title: 'Favoritos',
                drawerIcon: ({ color }) => <Text style={{fontSize: 22, color}}>⭐</Text>
            }}
        />
        <Drawer.Screen
            name="settings" 
            options={{
                drawerLabel: 'Configuración',
                title: 'Configuración',
                drawerIcon: ({ color }) => <Text style={{fontSize: 22, color}}>⚙️</Text>
            }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
