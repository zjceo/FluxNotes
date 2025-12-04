import { exportNoteToMarkdown } from '../exporter';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

jest.mock('expo-file-system');
jest.mock('expo-sharing');

describe('exportNoteToMarkdown', () => {
    const mockNote = {
        id: 1,
        title: 'Test Note',
        content: 'This is a test note.',
        is_favorite: false,
        created_at: '2023-01-01',
        updated_at: '2023-01-02',
    };

    it('should write file and share it', async () => {
        (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);

        await exportNoteToMarkdown(mockNote);

        expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
            expect.stringContaining('test_note.md'),
            expect.stringContaining('# Test Note'),
            expect.any(Object)
        );
        expect(Sharing.shareAsync).toHaveBeenCalled();
    });
});
