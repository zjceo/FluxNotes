import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Note } from '../types';

export const exportNoteToMarkdown = async (note: Note) => {
    try {
        const fileName = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled'}.md`;
        const fileUri = FileSystem.documentDirectory + fileName;

        const markdownContent = `# ${note.title}\n\n${note.content}\n\n---\nCreated: ${note.created_at}\nUpdated: ${note.updated_at}`;

        await FileSystem.writeAsStringAsync(fileUri, markdownContent, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            alert('Sharing is not available on this device');
        }
    } catch (error) {
        console.error('Error exporting note:', error);
        alert('Failed to export note');
    }
};
