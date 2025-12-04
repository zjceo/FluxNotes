import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useStore } from '../src/store/useStore';
import NoteCard from '../src/components/NoteCard';

export default function Home() {
    const { notes, isLoading, fetchNotes } = useStore();

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <View className="flex-1 px-4 pt-4">
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <Link href="/note/new" asChild>
                            <Pressable className="bg-blue-500 px-4 py-2 rounded-full active:bg-blue-600">
                                <Text className="text-white font-bold">+ New</Text>
                            </Pressable>
                        </Link>
                    ),
                }}
            />

            <FlatList
                data={notes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <NoteCard note={item} />}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchNotes} />
                }
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center mt-20">
                        <Text className="text-gray-400 text-lg">No notes yet</Text>
                        <Text className="text-gray-400 text-sm mt-2">Tap "+ New" to create one</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    );
}
