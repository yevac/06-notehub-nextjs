import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { Note, NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

type NewNote = Omit<Note, "id" | "createdAt" | "updatedAt">;

const schema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Content must be at most 500 characters")
    .required("Content is required"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

interface NoteFormProps {
  closeModal: () => void;
}

export default function NoteForm({ closeModal }: NoteFormProps) {
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
        {/* Title */}
        <label className={css.label}>
          Title
          <Field name="title" type="text" className={css.input} />
        </label>
        <ErrorMessage name="title" component="div" className={css.error} />

        {/* Content */}
        <label className={css.label}>
          Content
          <Field
            name="content"
            as="textarea"
            rows={5}
            className={css.textarea}
          />
        </label>
        <ErrorMessage name="content" component="div" className={css.error} />

        {/* Tag */}
        <label className={css.label}>
          Tag
          <Field name="tag" as="select" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
        </label>
        <ErrorMessage name="tag" component="div" className={css.error} />

        {/* Actions */}
        <div className={css.actions}>
          <button type="submit" disabled={mutation.isPending}>
            Create note
          </button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
}