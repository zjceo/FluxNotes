import { 
    View, 
    TextInput, 
    Pressable, 
    Text, 
    Alert, 
    ScrollView,
    StyleSheet,
    Animated,
    Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../src/store/useStore';
import { exportNoteToMarkdown } from '../../src/utils/exporter';

export default function NoteDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { notes, addNote, editNote, removeNote } = useStore();

    const isNew = id === 'new';
    const noteId = isNew ? -1 : Number(id);
    const existingNote = notes.find(n => n.id === noteId);

    const [title, setTitle] = useState(existingNote?.title || '');
    const [content, setContent] = useState(existingNote?.content || '');
    const [isFavorite, setIsFavorite] = useState(existingNote?.is_favorite || false);
    const [hasChanges, setHasChanges] = useState(false);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const saveButtonScale = useRef(new Animated.Value(1)).current;
    const titleInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (existingNote) {
            setTitle(existingNote.title);
            setContent(existingNote.content);
            setIsFavorite(existingNote.is_favorite);
        }
        
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();

        if (isNew) {
            setTimeout(() => titleInputRef.current?.focus(), 150);
        }
    }, [existingNote]);

    useEffect(() => {
        if (existingNote) {
            const changed = 
                title !== existingNote.title || 
                content !== existingNote.content ||
                isFavorite !== existingNote.is_favorite;
            setHasChanges(changed);
            
            if (changed) {
                Animated.sequence([
                    Animated.timing(saveButtonScale, {
                        toValue: 1.1,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(saveButtonScale, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        } else {
            setHasChanges(title.trim() !== '' || content.trim() !== '');
        }
    }, [title, content, isFavorite, existingNote]);

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Título requerido', 'Por favor ingresa un título para tu nota');
            return;
        }

        try {
            if (isNew) {
                await addNote(title, content);
            } else {
                await editNote(noteId, { title, content, is_favorite: isFavorite });
            }
            
            // Navegar hacia atrás solo si no estamos en la pantalla principal
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar la nota. Intenta nuevamente.');
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Eliminar Nota',
            '¿Estás seguro? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await removeNote(noteId);
                            router.back();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la nota.');
                        }
                    }
                },
            ]
        );
    };

    const handleExport = async () => {
        if (existingNote) {
            try {
                await exportNoteToMarkdown(existingNote);
                Alert.alert('¡Éxito!', 'Nota exportada correctamente');
            } catch (error) {
                Alert.alert('Error', 'No se pudo exportar la nota.');
            }
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const getCharCount = () => content.length;
    const getWordCount = () => content.trim().split(/\s+/).filter(word => word.length > 0).length;

    return (
        <View style={styles.container}>
            <Stack.Screen 
                options={{
                    headerShown: false,
                }} 
            />

            {/* Custom Header */}
            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                <View style={styles.headerContent}>
                    <Pressable 
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/');
                            }
                        }}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.backButtonPressed
                        ]}
                    >
                        <Text style={styles.backIcon}>←</Text>
                    </Pressable>
                    
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>
                            {isNew ? 'Nueva Nota' : 'Editar Nota'}
                        </Text>
                        {hasChanges && (
                            <View style={styles.unsavedIndicator}>
                                <View style={styles.unsavedDot} />
                                <Text style={styles.unsavedText}>Sin guardar</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.headerActions}>
                        {!isNew && (
                            <>
                                <Pressable 
                                    onPress={toggleFavorite}
                                    style={({ pressed }) => [
                                        styles.iconButton,
                                        isFavorite && styles.iconButtonFavorite,
                                        pressed && styles.iconButtonPressed
                                    ]}
                                >
                                    <Text style={styles.iconText}>
                                        {isFavorite ? '⭐' : '☆'}
                                    </Text>
                                </Pressable>
                                <Pressable 
                                    onPress={handleExport}
                                    style={({ pressed }) => [
                                        styles.iconButton,
                                        pressed && styles.iconButtonPressed
                                    ]}
                                >
                                    <Text style={styles.iconText}>↗</Text>
                                </Pressable>
                                <Pressable 
                                    onPress={handleDelete}
                                    style={({ pressed }) => [
                                        styles.iconButton,
                                        styles.deleteButton,
                                        pressed && styles.iconButtonPressed
                                    ]}
                                >
                                    <Text style={styles.iconText}>🗑</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </Animated.View>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.inputContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleLabel}>Título</Text>
                            <TextInput
                                ref={titleInputRef}
                                style={styles.titleInput}
                                placeholder="Escribe un título..."
                                placeholderTextColor="#94a3b8"
                                value={title}
                                onChangeText={setTitle}
                                maxLength={100}
                            />
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.contentContainer}>
                            <Text style={styles.contentLabel}>Contenido</Text>
                            <TextInput
                                style={styles.contentInput}
                                placeholder="Comienza a escribir..."
                                placeholderTextColor="#94a3b8"
                                multiline
                                textAlignVertical="top"
                                value={content}
                                onChangeText={setContent}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Stats Bar - Ahora clickeable para guardar cuando hay cambios */}
                <Pressable 
                    style={[
                        styles.statsBar,
                        hasChanges && styles.statsBarClickable
                    ]}
                    onPress={hasChanges ? handleSave : undefined}
                    disabled={!hasChanges}
                >
                    <View style={styles.statsContent}>
                        <View style={styles.stat}>
                            <Text style={styles.statIcon}>📝</Text>
                            <Text style={styles.statValue}>{getWordCount()}</Text>
                            <Text style={styles.statLabel}>palabras</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statIcon}>✏️</Text>
                            <Text style={styles.statValue}>{getCharCount()}</Text>
                            <Text style={styles.statLabel}>caracteres</Text>
                        </View>
                        {isFavorite && !isNew && (
                            <>
                                <View style={styles.statDivider} />
                                <View style={styles.favoriteIndicator}>
                                    <Text style={styles.favoriteIndicatorIcon}>⭐</Text>
                                    <Text style={styles.favoriteIndicatorText}>Favorita</Text>
                                </View>
                            </>
                        )}
                    </View>
                    
                    {hasChanges && (
                        <Animated.View 
                            style={[
                                styles.saveIndicator,
                                { transform: [{ scale: saveButtonScale }] }
                            ]}
                        >
                            <Text style={styles.saveIndicatorIcon}>✓</Text>
                            <Text style={styles.saveIndicatorText}>Toca para guardar</Text>
                        </Animated.View>
                    )}
                </Pressable>
            </Animated.View>
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
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonPressed: {
        backgroundColor: '#e2e8f0',
        transform: [{ scale: 0.95 }],
    },
    backIcon: {
        fontSize: 24,
        color: '#0f172a',
        fontWeight: '600',
    },
    headerCenter: {
        flex: 1,
        marginHorizontal: 16,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
    },
    unsavedIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    unsavedDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#f59e0b',
    },
    unsavedText: {
        fontSize: 12,
        color: '#f59e0b',
        fontWeight: '600',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButtonFavorite: {
        backgroundColor: '#fef3c7',
    },
    iconButtonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.9 }],
    },
    deleteButton: {
        backgroundColor: '#fee2e2',
    },
    iconText: {
        fontSize: 18,
    },
    content: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    inputContainer: {
        flex: 1,
        padding: 20,
    },
    titleContainer: {
        marginBottom: 24,
    },
    titleLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    titleInput: {
        fontSize: 32,
        fontWeight: '800',
        color: '#0f172a',
        paddingVertical: 12,
        letterSpacing: -0.5,
    },
    divider: {
        height: 2,
        backgroundColor: '#e2e8f0',
        marginBottom: 24,
    },
    contentContainer: {
        flex: 1,
    },
    contentLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    contentInput: {
        fontSize: 17,
        color: '#334155',
        lineHeight: 28,
        minHeight: 400,
    },
    statsBar: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
        gap: 10,
    },
    statsBarClickable: {
        backgroundColor: '#ecfdf5',
        borderTopColor: '#10b981',
        borderTopWidth: 2,
    },
    statsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statIcon: {
        fontSize: 16,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },
    statLabel: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: '#e2e8f0',
    },
    favoriteIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#fef3c7',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    favoriteIndicatorIcon: {
        fontSize: 14,
    },
    favoriteIndicatorText: {
        fontSize: 13,
        color: '#f59e0b',
        fontWeight: '700',
    },
    saveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#10b981',
        borderRadius: 14,
        alignSelf: 'stretch',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveIndicatorIcon: {
        fontSize: 20,
        color: '#ffffff',
    },
    saveIndicatorText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});