import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Note } from '../types';

interface NoteCardProps {
    note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
    return (
        <Link href={`/note/${note.id}`} asChild>
            <Pressable className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-3 active:opacity-70">
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white flex-1 mr-2" numberOfLines={1}>
                        {note.title || 'Untitled Note'}
                    </Text>
                    {note.is_favorite && (
                        <Text className="text-yellow-500">★</Text>
                    )}
                </View>
                <Text className="text-gray-600 dark:text-gray-400 leading-5" numberOfLines={3}>
                    {note.content || 'No content'}
                </Text>
                <Text className="text-xs text-gray-400 mt-3">
                    {new Date(note.updated_at).toLocaleDateString()}
                </Text>
            </Pressable>
        </Link>
    );
}
