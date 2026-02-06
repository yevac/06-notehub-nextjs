import axios from "axios";
import type { Note } from "../types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

axios.defaults.baseURL = "/api";
if (token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
} else {
  console.warn("⚠️ NEXT_PUBLIC_NOTEHUB_TOKEN не встановлена — клієнт використовуватиме /api/proxy (серверний токен)");
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  search: string
): Promise<FetchNotesResponse> => {
  const { data } = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search,
    },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await axios.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const { data } = await axios.post<Note>("/notes", note);
  return data;
};

export const updateNote = async (
  id: string,
  note: Partial<Note>
): Promise<Note> => {
  const { data } = await axios.patch<Note>(`/notes/${id}`, note);

  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(`/notes/${id}`);
  return data;
};



