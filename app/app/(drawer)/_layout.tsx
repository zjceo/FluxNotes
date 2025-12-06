import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer 
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: '#6366f1',
          drawerInactiveTintColor: '#4b5563',
          drawerLabelStyle: {
            marginLeft: -20,
            fontSize: 15,
            fontWeight: '600',
          },
          drawerStyle: {
            backgroundColor: '#ffffff',
            width: width * 0.75, // 75% del ancho
          },
          // CRÍTICO: estas opciones controlan el comportamiento
          drawerType: 'front', // El drawer aparece por encima
          overlayColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro
          swipeEnabled: true,
          swipeEdgeWidth: 50,
          // Asegurar que el contenido no se desplace
          drawerPosition: 'left',
        }}
      >
        <Drawer.Screen
          name="index"
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