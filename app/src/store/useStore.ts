import { create } from 'zustand';
import { Note } from '../types';
import { getNotes, createNote, updateNote, deleteNote } from '../services/api';

interface StoreState {
    notes: Note[];
    isLoading: boolean;
    error: string | null;
    fetchNotes: () => Promise<void>;
    addNote: (title: string, content: string) => Promise<void>;
    editNote: (id: number, updates: Partial<Note>) => Promise<void>;
    removeNote: (id: number) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
    notes: [],
    isLoading: false,
    error: null,

    fetchNotes: async () => {
        set({ isLoading: true, error: null });
        try {
            const notes = await getNotes();
            set({ notes, isLoading: false });
        } catch (err) {
            set({ error: 'Failed to fetch notes', isLoading: false });
        }
    },

    addNote: async (title, content) => {
        set({ isLoading: true, error: null });
        try {
            const newNote = await createNote(title, content);
            set((state) => ({
                notes: [newNote, ...state.notes],
                isLoading: false
            }));
        } catch (err) {
            set({ error: 'Failed to create note', isLoading: false });
        }
    },

    editNote: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const updatedNote = await updateNote(id, updates);
            set((state) => ({
                notes: state.notes.map((n) => (n.id === id ? updatedNote : n)),
                isLoading: false,
            }));
        } catch (err) {
            set({ error: 'Failed to update note', isLoading: false });
        }
    },

    removeNote: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await deleteNote(id);
            set((state) => ({
                notes: state.notes.filter((n) => n.id !== id),
                isLoading: false,
            }));
        } catch (err) {
            set({ error: 'Failed to delete note', isLoading: false });
        }
    },
}));
