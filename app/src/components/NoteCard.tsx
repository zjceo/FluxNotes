import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Note } from '../types';

interface NoteCardProps {
    note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
    const getPreview = () => {
        if (!note.content || note.content.trim() === '') {
            return 'No content';
        }
        return note.content.length > 150 
            ? note.content.substring(0, 150) + '...' 
            : note.content;
    };

    const getWordCount = () => {
        if (!note.content) return 0;
        return note.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const getColorForNote = (id: number) => {
        const colors = [
            { bg: '#fef3c7', border: '#fbbf24', accent: '#f59e0b' },
            { bg: '#dbeafe', border: '#60a5fa', accent: '#3b82f6' },
            { bg: '#fce7f3', border: '#f472b6', accent: '#ec4899' },
            { bg: '#d1fae5', border: '#34d399', accent: '#10b981' },
            { bg: '#e9d5ff', border: '#a78bfa', accent: '#8b5cf6' },
        ];
        return colors[id % colors.length];
    };

    const noteColor = getColorForNote(note.id);

    return (
        <Link href={`/note/${note.id}`} asChild>
            <Pressable 
                style={({ pressed }) => [
                    styles.card,
                    { 
                        backgroundColor: noteColor.bg,
                        borderLeftColor: noteColor.border,
                    },
                    pressed && styles.cardPressed
                ]}
            >
                {note.is_favorite && (
                    <View style={[styles.favoriteIndicator, { backgroundColor: noteColor.accent }]}>
                        <Text style={styles.favoriteStar}>★</Text>
                    </View>
                )}

                <View style={styles.cardHeader}>
                    <Text 
                        style={styles.title} 
                        numberOfLines={2}
                    >
                        {note.title || 'Untitled Note'}
                    </Text>
                </View>

                <Text style={styles.preview} numberOfLines={3}>
                    {getPreview()}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.metaInfo}>
                        <Text style={styles.date}>
                            {formatDate(note.updated_at)}
                        </Text>
                        {getWordCount() > 0 && (
                            <>
                                <Text style={styles.separator}>•</Text>
                                <Text style={styles.wordCount}>
                                    {getWordCount()} words
                                </Text>
                            </>
                        )}
                    </View>
                    <Text style={styles.arrow}>→</Text>
                </View>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        position: 'relative',
    },
    cardPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    favoriteIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    favoriteStar: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    cardHeader: {
        marginBottom: 8,
        paddingRight: 36,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        lineHeight: 24,
    },
    preview: {
        fontSize: 14,
        color: '#4b5563',
        lineHeight: 20,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    date: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    separator: {
        fontSize: 12,
        color: '#9ca3af',
    },
    wordCount: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    arrow: {
        fontSize: 18,
        color: '#9ca3af',
    },
});