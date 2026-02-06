import axios from "axios";
import type { Note } from "../types/note";

export interface NoteListResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${
  process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
}`;

export const getNotes = async (
  page: number,
  search: string
): Promise<NoteListResponse> => {
  const { data } = await axios.get<NoteListResponse>("/notes", {
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



