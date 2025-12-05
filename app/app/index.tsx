import { View, Text, FlatList, Pressable, RefreshControl, StyleSheet, Animated } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useStore } from '../src/store/useStore';
import NoteCard from '../src/components/NoteCard';

export default function Home() {
    const { notes, isLoading, fetchNotes } = useStore();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetchNotes();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, []);

    const favoriteNotes = notes.filter(note => note.is_favorite);
    const regularNotes = notes.filter(note => !note.is_favorite);

    return (
        <View style={styles.container}>
             <Stack.Screen
                options={{
                    headerRight: () => (
                        <Link href="/note/new" asChild>
                            <Pressable style={styles.newButton}>
                                <Text style={styles.newButtonText}>+ New</Text>
                            </Pressable>
                        </Link>
                    ),
                    headerLeft: () => (
                        <View style={styles.headerLeft}>
                            <Text style={styles.headerTitle}>My Notes</Text>
                            <View style={styles.headerStats}>
                                <Text style={styles.headerSubtitle}>
                                    {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                                </Text>
                                {favoriteNotes.length > 0 && (
                                    <>
                                        <Text style={styles.statsSeparator}>•</Text>
                                        <Text style={styles.favoriteCount}>
                                            ★ {favoriteNotes.length}
                                        </Text>
                                    </>
                                )}
                            </View>
                        </View>
                    ),
                    title: '',
                }}
            />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{
                                    translateY: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [50, 0],
                                    }),
                                }],
                            }}
                        >
                            <NoteCard note={item} />
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
                            <View style={styles.emptyIconContainer}>
                                <Text style={styles.emptyIcon}>📝</Text>
                            </View>
                            <Text style={styles.emptyTitle}>No notes yet</Text>
                            <Text style={styles.emptyText}>
                                Create your first note to get started.{'\n'}
                                Your ideas deserve a home!
                            </Text>
                            <Link href="/note/new" asChild>
                                <Pressable 
                                    style={({ pressed }) => [
                                        styles.emptyButton,
                                        pressed && styles.emptyButtonPressed
                                    ]}
                                >
                                    <Text style={styles.emptyButtonText}>Create Your First Note</Text>
                                </Pressable>
                            </Link>
                        </View>
                    }
                    contentContainerStyle={[
                        styles.listContent,
                        notes.length === 0 && styles.listContentEmpty
                    ]}
                    showsVerticalScrollIndicator={false}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        flex: 1,
    },
    headerLeft: {
        marginLeft: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
    },
    headerStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        gap: 6,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6b7280',
        fontWeight: '500',
    },
    statsSeparator: {
        fontSize: 12,
        color: '#9ca3af',
    },
    favoriteCount: {
        fontSize: 13,
        color: '#f59e0b',
        fontWeight: '600',
    },
    newButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    newButtonPressed: {
        backgroundColor: '#4f46e5',
        transform: [{ scale: 0.96 }],
    },
    plusIcon: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '600',
    },
    newButtonText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 15,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    listContentEmpty: {
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        minHeight: 500,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyIcon: {
        fontSize: 40,
    },
    emptyTitle: {
        color: '#1f2937',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptyText: {
        color: '#6b7280',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
    },
    emptyButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    emptyButtonPressed: {
        backgroundColor: '#4f46e5',
        transform: [{ scale: 0.96 }],
    },
    emptyButtonText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 16,
    },
});