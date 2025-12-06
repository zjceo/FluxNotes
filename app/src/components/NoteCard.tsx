import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Note } from '../types';

interface NoteCardProps {
    note: Note;
    index?: number;
}

export default function NoteCard({ note, index = 0 }: NoteCardProps) {
    const getPreview = () => {
        if (!note.content || note.content.trim() === '') {
            return 'Sin contenido';
        }
        const maxLength = 100;
        if (note.content.length > maxLength) {
            return note.content.substring(0, maxLength).trim() + '...';
        }
        return note.content;
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

        if (diffMins < 1) return 'Ahora mismo';
        if (diffMins < 60) return `Hace ${diffMins}m`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        
        return date.toLocaleDateString('es-ES', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const getColorForNote = (id: number) => {
        const colors = [
            { 
                solid: '#667eea',
                light: '#f3f4ff',
            },
            { 
                solid: '#f093fb',
                light: '#fff0f7',
            },
            { 
                solid: '#4facfe',
                light: '#f0faff',
            },
            { 
                solid: '#43e97b',
                light: '#f0fff8',
            },
            { 
                solid: '#fa709a',
                light: '#fff9f0',
            },
        ];
        return colors[id % colors.length];
    };

    const noteColor = getColorForNote(note.id);

    return (
        <Link href={`/note/${note.id}`} asChild>
            <Pressable 
                style={({ pressed }) => [
                    styles.card,
                    pressed && styles.cardPressed
                ]}
            >
                <View style={styles.cardContent}>
                    {/* Header compacto */}
                    <View style={[styles.cardHeader, { backgroundColor: noteColor.light }]}>
                        <View style={styles.headerTop}>
                            <View style={[styles.colorIndicator, { backgroundColor: noteColor.solid }]} />
                            <Text style={styles.dateText}>{formatDate(note.updated_at)}</Text>
                        </View>
                        {note.is_favorite && (
                            <View style={styles.favoriteChip}>
                                <Text style={styles.favoriteIcon}>⭐</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.cardBody}>
                        <Text style={styles.title} numberOfLines={2}>
                            {note.title || 'Nota sin título'}
                        </Text>
                        
                        <Text style={styles.preview} numberOfLines={2}>
                            {getPreview()}
                        </Text>

                        {/* Footer con stats - más compacto */}
                        <View style={styles.footer}>
                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>📝</Text>
                                    <Text style={styles.statText}>
                                        {getWordCount()} palabras
                                    </Text>
                                </View>
                            </View>
                            
                            <View style={[styles.openButton, { backgroundColor: noteColor.solid }]}>
                                <Text style={styles.openButtonText}>Abrir</Text>
                                <Text style={styles.arrowIcon}>→</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        // Sin maxHeight - altura dinámica
    },
    cardPressed: {
        opacity: 0.95,
        transform: [{ scale: 0.98 }],
    },
    cardContent: {
        flex: 1,
    },
    cardHeader: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    colorIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dateText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '600',
    },
    favoriteChip: {
        width: 28,
        height: 28,
        backgroundColor: '#fef3c7',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fbbf24',
    },
    favoriteIcon: {
        fontSize: 14,
    },
    cardBody: {
        padding: 16,
        gap: 12, // Espaciado uniforme entre elementos
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        lineHeight: 24,
        letterSpacing: -0.2,
    },
    preview: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    statsContainer: {
        flex: 1,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statIcon: {
        fontSize: 14,
    },
    statText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    openButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    openButtonText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '700',
    },
    arrowIcon: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});