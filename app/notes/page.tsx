import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

export default async function NotesPage() {
  const queryClient = new QueryClient();

  const params = { page: 1, perPage: PER_PAGE, search: "" };

  await queryClient.prefetchQuery({
    queryKey: ["notes", params],
    queryFn: () => getNotes(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
