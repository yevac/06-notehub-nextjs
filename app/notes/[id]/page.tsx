import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const NoteDetailsClient = dynamic(() => import("./NoteDetails.client"));

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", resolvedParams.id],
    queryFn: () => fetchNoteById(resolvedParams.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
