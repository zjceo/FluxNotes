import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Note } from '../types';

// Variables de entorno desde .env (no hardcodeadas por seguridad)
// Fallback a la IP local detectada para desarrollo Android
const API_IP = process.env.EXPO_PUBLIC_API_IP || '192.168.1.7';
const API_PORT = process.env.EXPO_PUBLIC_API_PORT || '3000';

const getApiUrl = () => {
    if (__DEV__) {
        // Forzamos el uso de la IP local para evitar problemas con localhost en Android
        console.log(`[API] Configuring API URL for ${Platform.OS}`);
        console.log(`[API] Using IP: ${API_IP}`);
        return `http://${API_IP}:${API_PORT}/api`;
    }
    // Production
    return `http://${API_IP}:${API_PORT}/api`;
};

const API_URL = getApiUrl();
console.log('[API] Base URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 segundos de timeout
});

// Interceptor para logs de error
api.interceptors.request.use(request => {
    console.log('[API Request]', request.method?.toUpperCase(), request.url);
    return request;
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('[API Error]', error.message);
        if (error.response) {
            console.error('[API Error Data]', error.response.data);
            console.error('[API Error Status]', error.response.status);
        } else if (error.request) {
            console.error('[API Error Request] No response received. Is the server running?');
            console.error('[API Error Request Info]', error.request._response);
        }
        return Promise.reject(error);
    }
);

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
