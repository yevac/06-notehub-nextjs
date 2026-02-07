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
        <button type="button" onClick={closeModal}>
            Cancel
        </button>

        <Field name="tag" as="select">
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </Field>

        <ErrorMessage name="tag" component="div" className={css.error} />

        <button type="submit">Create note</button>
      </Form>
    </Formik>
  );
}
