import { Note } from "@/lib/definitions";
import Link from "next/link";

export default function NoteButton({ item }: { item: Note }) {
  return (
    <Link
      href={`/note/${item.id}`}
      className="w-full rounded-lg border border-gray-500 bg-button p-5 text-left"
    >
      <h3 className="mb-1 font-bold">{item.name}</h3>
      <p className="truncate text-sm text-muted-foreground">{item.content}</p>
    </Link>
  );
}
