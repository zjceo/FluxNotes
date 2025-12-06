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
        const maxLength = 120;
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
                bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                solid: '#667eea',
                light: '#f3f4ff',
                accent: '#5568d3'
            },
            { 
                bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                solid: '#f093fb',
                light: '#fff0f7',
                accent: '#d97dc9'
            },
            { 
                bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                solid: '#4facfe',
                light: '#f0faff',
                accent: '#3d91e0'
            },
            { 
                bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                solid: '#43e97b',
                light: '#f0fff8',
                accent: '#35ca67'
            },
            { 
                bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                solid: '#fa709a',
                light: '#fff9f0',
                accent: '#e05d85'
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
                    {/* Header con gradiente */}
                    <View style={[styles.cardHeader, { backgroundColor: noteColor.light }]}>
                        <View style={styles.headerTop}>
                            <View style={[styles.colorIndicator, { backgroundColor: noteColor.solid }]} />
                            <Text style={styles.dateText}>{formatDate(note.updated_at)}</Text>
                        </View>
                        {note.is_favorite && (
                            <View style={styles.favoriteChip}>
                                <Text style={styles.favoriteIcon}>⭐</Text>
                                <Text style={styles.favoriteText}>Favorita</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.cardBody}>
                        <Text style={styles.title} numberOfLines={2}>
                            {note.title || 'Nota sin título'}
                        </Text>
                        
                        <Text style={styles.preview} numberOfLines={3}>
                            {getPreview()}
                        </Text>

                        {/* Indicador de contenido largo */}
                        {note.content.length > 120 && (
                            <View style={styles.moreContentIndicator}>
                                <View style={styles.dotIndicator} />
                                <View style={styles.dotIndicator} />
                                <View style={styles.dotIndicator} />
                            </View>
                        )}

                        {/* Footer con stats */}
                        <View style={styles.footer}>
                            <View style={styles.statsContainer}>
                                {getWordCount() > 0 && (
                                    <View style={styles.statItem}>
                                        <Text style={styles.statIcon}>📝</Text>
                                        <Text style={styles.statText}>
                                            {getWordCount()} palabras
                                        </Text>
                                    </View>
                                )}
                                {note.content && note.content.length > 0 && (
                                    <View style={styles.statItem}>
                                        <Text style={styles.statIcon}>✏️</Text>
                                        <Text style={styles.statText}>
                                            {note.content.length} caracteres
                                        </Text>
                                    </View>
                                )}
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
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        maxHeight: 220,
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
        paddingVertical: 12,
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#fef3c7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fbbf24',
    },
    favoriteIcon: {
        fontSize: 12,
    },
    favoriteText: {
        fontSize: 11,
        color: '#f59e0b',
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    cardBody: {
        padding: 16,
        maxHeight: 140,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        lineHeight: 24,
        marginBottom: 8,
        letterSpacing: -0.2,
    },
    preview: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
        marginBottom: 8,
        maxHeight: 60,
        overflow: 'hidden',
    },
    moreContentIndicator: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
        marginBottom: 8,
    },
    dotIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#94a3b8',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        marginTop: 4,
    },
    statsContainer: {
        flex: 1,
        gap: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statIcon: {
        fontSize: 12,
    },
    statText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    openButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
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
        fontSize: 14,
        fontWeight: '600',
    },
});