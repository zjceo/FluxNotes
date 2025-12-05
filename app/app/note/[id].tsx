import { View, TextInput, Pressable, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (existingNote) {
            setTitle(existingNote.title);
            setContent(existingNote.content);
        }
    }, [existingNote]);

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Title cannot be empty');
            return;
        }

        if (isNew) {
            await addNote(title, content);
        } else {
            await editNote(noteId, { title, content });
        }
        router.back();
    };

    const handleDelete = async () => {
        Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await removeNote(noteId);
                        router.back();
                    }
                },
            ]
        );
    };

    const handleExport = async () => {
        if (existingNote) {
            await exportNoteToMarkdown(existingNote);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <Stack.Screen
                options={{
                    title: isNew ? 'New Note' : 'Edit Note',
                    headerRight: () => (
                        <View className="flex-row gap-2">
                            {!isNew && (
                                <>
                                    <Pressable onPress={handleExport} className="p-2">
                                        <Text className="text-blue-500">Export</Text>
                                    </Pressable>
                                    <Pressable onPress={handleDelete} className="p-2">
                                        <Text className="text-red-500">Delete</Text>
                                    </Pressable>
                                </>
                            )}
                            <Pressable onPress={handleSave} className="p-2">
                                <Text className="text-blue-500 font-bold">Save</Text>
                            </Pressable>
                        </View>
                    ),
                }}
            />
            <ScrollView className="flex-1 p-4">
                <TextInput
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                    placeholder="Title"
                    placeholderTextColor="#9ca3af"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    className="text-base text-gray-700 dark:text-gray-300 min-h-[200px]"
                    placeholder="Start typing..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    textAlignVertical="top"
                    value={content}
                    onChangeText={setContent}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
