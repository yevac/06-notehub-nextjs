"use client";

import { useState } from "react";
import css from "./Notes.module.css";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes, type FetchNotesResponse } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";

export default function NotesClient() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const toggleModal = () => setIsModalOpen((v) => !v);

  const { data, isLoading, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", currentPage, search],
    queryFn: () => fetchNotes(currentPage, search),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleChange} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
          />
        )}
        <button onClick={toggleModal} className={css.button}>
          Create note +
        </button>
      </header>

      {isModalOpen && (
        <Modal onClose={toggleModal}>
            <NoteForm closeModal={toggleModal} />
        </Modal>
      )}

      {notes.length > 0 ? <NoteList notes={notes} /> : <p>No notes</p>}
    </div>
  );
}
