import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Note } from '../types';

// Variables de entorno desde .env (no hardcodeadas por seguridad)
const API_IP = process.env.EXPO_PUBLIC_API_IP || 'localhost';
const API_PORT = process.env.EXPO_PUBLIC_API_PORT || '3000';

const getApiUrl = () => {
    if (__DEV__) {
        if (Platform.OS === 'android') {
            // Intenta obtener la IP automáticamente desde Expo, si no usa la del .env
            const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
            const localIp = debuggerHost || API_IP;
            return `http://${localIp}:${API_PORT}/api`;
        }
        // iOS simulator
        return `http://localhost:${API_PORT}/api`;
    }
    // Production - usa variables de entorno
    return `http://${API_IP}:${API_PORT}/api`;
};

const API_URL = getApiUrl();

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
