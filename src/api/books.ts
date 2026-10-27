
import { Platform } from 'react-native';
import type { Book } from '../types';

export const BASE_URL =
  Platform.OS === 'android'
    ? 'http://172.16.73.59:3000'
    : 'http://localhost:3000';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);

  if (!res.ok) {
    throw new Error(`Lỗi ${res.status} khi gọi ${path}`);
  }

  return res.json() as Promise<T>;
}

export const fetchBooks = () => request<Book[]>('/books');

export const fetchBookById = (id: string) =>
  request<Book>(`/books/${id}`);
