"use client";

import { useEffect, useState } from "react";
import css from "./Notes.module.css";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getNotes, NoteListResponse,} from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";

export default function NotesClient() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);


  const handleChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isLoading, error } = useQuery<NoteListResponse, Error>({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () => getNotes(currentPage, debouncedSearch),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onSearch={handleChange} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </header>

      {isModalOpen && (
        <Modal onClose={closeModal}>
            <NoteForm closeModal={closeModal} />
        </Modal>
      )}

      {notes.length > 0 ? <NoteList notes={notes} /> : <p>No notes</p>}
    </div>
  );
}
