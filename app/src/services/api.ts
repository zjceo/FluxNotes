import axios from 'axios';
import { Note } from '../types';

// Replace with your machine's local IP if testing on physical device
const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

export const getNotes = async (): Promise<Note[]> => {
    const response = await api.get('/notes');
    return response.data;
};

export const getNote = async (id: number): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
};

export const createNote = async (title: string, content: string): Promise<Note> => {
    const response = await api.post('/notes', { title, content });
    return response.data;
};

export const updateNote = async (id: number, updates: Partial<Note>): Promise<Note> => {
    const response = await api.put(`/notes/${id}`, updates);
    return response.data;
};

export const deleteNote = async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}`);
};
