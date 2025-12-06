import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function Settings() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Pressable 
                        style={({pressed}) => [styles.iconContainer, pressed && styles.iconPressed]}
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                    >
                        <Text style={styles.appIcon}>☰</Text>
                    </Pressable>
                    <Text style={styles.headerTitle}>Configuración</Text>
                    <View style={{width: 44}} /> 
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.icon}>⚙️</Text>
                    </View>
                    <Text style={styles.title}>Próximamente</Text>
                    <Text style={styles.description}>
                        Estamos trabajando en nuevas opciones de personalización, temas y gestión de copias de seguridad.
                    </Text>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.versionText}>FluxNotes v1.0.0</Text>
                    <Text style={styles.buildText}>Build 2025.12.05</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#ffffff',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconPressed: {
        backgroundColor: '#e2e8f0',
    },
    appIcon: {
        fontSize: 24,
        color: '#0f172a',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        width: '100%',
        maxWidth: 320,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    icon: {
        fontSize: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
    },
    infoSection: {
        marginTop: 40,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94a3b8',
    },
    buildText: {
        fontSize: 12,
        color: '#cbd5e1',
        marginTop: 4,
    },
});
