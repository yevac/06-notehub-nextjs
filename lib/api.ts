import axios from "axios";
import type { Note } from "@/types/note";

export interface NoteListResponse {
  notes: Note[];
  totalPages: number;
}

const API_BASE_URL = "https://notehub-public.goit.study/api";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


export const getNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<NoteListResponse> => {
  const { data } = await instance.get<NoteListResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search,
      ...(tag && tag !== "all" && { tag }),
    },
  });

  return data;
};


export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await instance.get<Note>(`/notes/${id}`);
  return data;
};


export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const { data } = await instance.post<Note>("/notes", note);
  return data;
};

export const updateNote = async (
  id: string,
  note: Partial<Note>
): Promise<Note> => {
  const { data } = await instance.patch<Note>(`/notes/${id}`, note);

  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(`/notes/${id}`);
  return data;
};



