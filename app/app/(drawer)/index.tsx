import { View, Text, FlatList, Pressable, RefreshControl, StyleSheet, Animated, TextInput } from 'react-native';
import { Link, Stack, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { DrawerActions } from '@react-navigation/native';
import { useStore } from '../../src/store/useStore';
import NoteCard from '../../src/components/NoteCard';

export default function Home() {
    const { notes, isLoading, fetchNotes } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    useEffect(() => {
        fetchNotes();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            note.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const finalNotes = searchQuery ? filteredNotes : notes;
    const favoriteNotes = notes.filter(n => n.is_favorite);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                <View style={styles.headerTop}>
                    <View style={styles.headerLeft}>
                        <Pressable 
                            style={({pressed}) => [styles.iconContainer, pressed && styles.iconPressed]}
                            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        >
                            <Text style={styles.appIcon}>☰</Text>
                        </Pressable>
                        <View>
                            <Text style={styles.headerTitle}>FluxNotes</Text>
                            <Text style={styles.headerSubtitle}>
                                {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
                                {favoriteNotes.length > 0 && ` • ⭐ ${favoriteNotes.length}`}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar notas..."
                        placeholderTextColor="#94a3b8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearIcon}>✕</Text>
                        </Pressable>
                    )}
                </View>
            </Animated.View>

            <FlatList
                data={finalNotes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{
                                translateY: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [30, 0],
                                }),
                            }],
                        }}
                    >
                        <NoteCard note={item} index={index} />
                    </Animated.View>
                )}
                refreshControl={
                    <RefreshControl 
                        refreshing={isLoading} 
                        onRefresh={fetchNotes}
                        tintColor="#6366f1"
                        colors={['#6366f1']}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyContent}>
                            <View style={styles.emptyIconContainer}>
                                <Text style={styles.emptyIcon}>{searchQuery ? '🔍' : '📝'}</Text>
                            </View>
                            <Text style={styles.emptyTitle}>
                                {searchQuery ? 'No se encontraron notas' : 'Comienza a escribir'}
                            </Text>
                            <Text style={styles.emptyText}>
                                {searchQuery
                                    ? 'Intenta con otros términos de búsqueda'
                                    : 'Crea tu primera nota y organiza tus ideas'}
                            </Text>
                            {!searchQuery && (
                                <Link href="/note/new" asChild>
                                    <Pressable 
                                        style={({ pressed }) => [
                                            styles.emptyButton,
                                            pressed && styles.emptyButtonPressed
                                        ]}
                                    >
                                        <Text style={styles.emptyButtonIcon}>✨</Text>
                                        <Text style={styles.emptyButtonText}>Crear Primera Nota</Text>
                                    </Pressable>
                                </Link>
                            )}
                        </View>
                    </View>
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                style={styles.content}
            />

            <Link href="/note/new" asChild>
                <Pressable 
                    style={({ pressed }) => [
                        styles.floatingAddButton,
                        pressed && styles.floatingAddButtonPressed
                    ]}
                >
                    <Text style={styles.floatingAddIcon}>+</Text>
                </Pressable>
            </Link>
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
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
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
        fontSize: 28,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
        marginTop: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#0f172a',
        fontWeight: '500',
    },
    clearIcon: {
        fontSize: 18,
        color: '#94a3b8',
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    listContent: {
        padding: 20,
        paddingBottom: 120,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        minHeight: 500,
    },
    emptyContent: {
        alignItems: 'center',
        maxWidth: 320,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 3,
        borderColor: '#e2e8f0',
    },
    emptyIcon: {
        fontSize: 48,
    },
    emptyTitle: {
        color: '#0f172a',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyText: {
        color: '#64748b',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#6366f1',
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    emptyButtonPressed: {
        backgroundColor: '#4f46e5',
        transform: [{ scale: 0.95 }],
    },
    emptyButtonIcon: {
        fontSize: 20,
    },
    emptyButtonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 17,
    },
    floatingAddButton: {
        position: 'absolute',
        bottom: 32,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
    floatingAddButtonPressed: {
        backgroundColor: '#4f46e5',
        transform: [{ scale: 0.92 }],
    },
    floatingAddIcon: {
        color: '#ffffff',
        fontSize: 36,
        fontWeight: '300',
        lineHeight: 36,
    },
});
