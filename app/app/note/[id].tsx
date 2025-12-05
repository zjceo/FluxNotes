import { 
    View, 
    TextInput, 
    Pressable, 
    Text, 
    Alert, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView,
    StyleSheet,
    Animated
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useNavigation } from 'expo-router';
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
    const titleInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (existingNote) {
            setTitle(existingNote.title);
            setContent(existingNote.content);
            setIsFavorite(existingNote.is_favorite);
        }
        
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        if (isNew) {
            setTimeout(() => titleInputRef.current?.focus(), 100);
        }
    }, [existingNote]);

    useEffect(() => {
        if (existingNote) {
            const changed = 
                title !== existingNote.title || 
                content !== existingNote.content ||
                isFavorite !== existingNote.is_favorite;
            setHasChanges(changed);
        } else {
            setHasChanges(title.trim() !== '' || content.trim() !== '');
        }
    }, [title, content, isFavorite, existingNote]);

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Title Required', 'Please enter a title for your note');
            return;
        }

        try {
            if (isNew) {
                await addNote(title, content);
            } else {
                await editNote(noteId, { title, content, is_favorite: isFavorite });
            }
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to save note. Please try again.');
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await removeNote(noteId);
                            router.back();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete note. Please try again.');
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
                Alert.alert('Success', 'Note exported successfully!');
            } catch (error) {
                Alert.alert('Error', 'Failed to export note. Please try again.');
            }
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const getCharCount = () => {
        return content.length;
    };

    const getWordCount = () => {
        return content.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const navigation = useRouter(); // We need navigation prop, but router works too with setOptions usually. Actually let's use useNavigation from expo-router
    const nav = useNavigation();

    useEffect(() => {
        nav.setOptions({
            title: isNew ? 'New Note' : 'Edit Note',
            headerRight: () => (
                <View style={styles.headerRight}>
                    {!isNew && (
                        <>
                            <Pressable 
                                onPress={toggleFavorite}
                                style={({ pressed }) => [
                                    styles.favoriteButton,
                                    isFavorite && styles.favoriteButtonActive,
                                    pressed && styles.headerButtonPressed
                                ]}
                            >
                                <Text style={[
                                    styles.favoriteIcon,
                                    isFavorite && styles.favoriteIconActive
                                ]}>
                                    ★
                                </Text>
                            </Pressable>
                            <Pressable 
                                onPress={handleExport} 
                                style={({ pressed }) => [
                                    styles.headerButton,
                                    pressed && styles.headerButtonPressed
                                ]}
                            >
                                <Text style={styles.exportText}>↗</Text>
                            </Pressable>
                            <Pressable 
                                onPress={handleDelete}
                                style={({ pressed }) => [
                                    styles.headerButton,
                                    pressed && styles.headerButtonPressed
                                ]}
                            >
                                <Text style={styles.deleteText}>🗑</Text>
                            </Pressable>
                        </>
                    )}
                    <Pressable 
                        onPress={handleSave}
                        style={({ pressed }) => [
                            styles.saveButton,
                            !hasChanges && styles.saveButtonDisabled,
                            pressed && hasChanges && styles.saveButtonPressed
                        ]}
                        disabled={!hasChanges}
                    >
                        <Text style={[
                            styles.saveButtonText,
                            !hasChanges && styles.saveButtonTextDisabled
                        ]}>
                            Save
                        </Text>
                    </Pressable>
                </View>
            ),
        });
    }, [isNew, isFavorite, hasChanges, handleSave, toggleFavorite, handleExport, handleDelete]);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: isNew ? 'New Note' : 'Edit Note' }} />
            
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={titleInputRef}
                            style={styles.titleInput}
                            placeholder="Note Title"
                            placeholderTextColor="#9ca3af"
                            value={title}
                            onChangeText={setTitle}
                            maxLength={100}
                        />
                        
                        <View style={styles.divider} />
                        
                        <TextInput
                            style={styles.contentInput}
                            placeholder="Start writing your note..."
                            placeholderTextColor="#9ca3af"
                            multiline
                            textAlignVertical="top"
                            value={content}
                            onChangeText={setContent}
                        />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <View style={styles.footerLeft}>
                        <Text style={styles.footerText}>
                            {getWordCount()} words · {getCharCount()} characters
                        </Text>
                        {hasChanges && (
                            <View style={styles.unsavedIndicator}>
                                <View style={styles.unsavedDot} />
                                <Text style={styles.unsavedText}>Unsaved</Text>
                            </View>
                        )}
                    </View>
                    {isFavorite && !isNew && (
                        <View style={styles.favoriteTag}>
                            <Text style={styles.favoriteTagText}>★ Favorite</Text>
                        </View>
                    )}
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        flex: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginRight: 8,
    },
    headerButton: {
        padding: 8,
        borderRadius: 8,
    },
    headerButtonPressed: {
        backgroundColor: '#f3f4f6',
    },
    favoriteButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
    },
    favoriteButtonActive: {
        backgroundColor: '#fef3c7',
    },
    favoriteIcon: {
        fontSize: 18,
        color: '#d1d5db',
    },
    favoriteIconActive: {
        color: '#f59e0b',
    },
    exportText: {
        fontSize: 18,
        color: '#6366f1',
    },
    deleteText: {
        fontSize: 18,
    },
    saveButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 4,
    },
    saveButtonDisabled: {
        backgroundColor: '#e5e7eb',
    },
    saveButtonPressed: {
        backgroundColor: '#4f46e5',
    },
    saveButtonText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 15,
    },
    saveButtonTextDisabled: {
        color: '#9ca3af',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    inputContainer: {
        flex: 1,
        padding: 20,
    },
    titleInput: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 16,
        paddingVertical: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginBottom: 16,
    },
    contentInput: {
        fontSize: 16,
        color: '#4b5563',
        lineHeight: 24,
        minHeight: 400,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#f9fafb',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    footerText: {
        fontSize: 13,
        color: '#6b7280',
    },
    unsavedIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
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
        fontWeight: '500',
    },
    favoriteTag: {
        backgroundColor: '#fef3c7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    favoriteTagText: {
        fontSize: 12,
        color: '#f59e0b',
        fontWeight: '600',
    },
});