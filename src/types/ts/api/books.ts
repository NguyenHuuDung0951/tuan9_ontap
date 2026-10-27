import type { Book } from "@/types.ts";
import { Platform } from 'react-native';

// Nếu dùng Expo Go trên điện thoại thật,
// đổi thành IP LAN của máy tính.
export const BASE_URL =
  Platform.OS === 'android'
    ? 'http://172.16.73.59:3000'
    : 'http://localhost:3000';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(
      `Lỗi HTTP ${response.status} khi gọi ${path}`
    );
  }

  return response.json() as Promise<T>;
}

export const fetchBooks = () =>
  request<Book[]>('/books');

export const fetchBookById = (id: string) =>
  request<Book>(`/books/${id}`);
