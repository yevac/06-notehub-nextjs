import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { Note, NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

type NewNote = Omit<Note, "id" | "createdAt" | "updatedAt">;

const schema = Yup.object({
  title: Yup.string().min(3).max(50).required(),
  content: Yup.string().max(500),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required(),
});

interface NoteListProps {
  closeModal: () => void;
}

export default function NoteForm({ closeModal }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      closeModal();
    },
  });

  return (
    <Formik<NewNote>
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={schema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      <Form className={css.form}>
        <Field name="title" placeholder="Title" />
        <ErrorMessage name="title" component="div" className={css.error} />
        <Field name="content" as="textarea" placeholder="Content" />
        <ErrorMessage name="content" component="div" className={css.error} />
        <Field name="tag" as="select">
        <ErrorMessage name="tag" component="div" className={css.error} />
          <option>Todo</option>
          <option>Work</option>
          <option>Personal</option>
          <option>Meeting</option>
          <option>Shopping</option>
        </Field>

        <button type="submit">Create note</button>
      </Form>
    </Formik>
  );
}
