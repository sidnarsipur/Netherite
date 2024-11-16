import { Note } from "@/lib/definitions";

export default function NoteButton({ item }: { item: Note }) {
  return (
    <div className="w-full rounded-lg border border-gray-500 bg-button p-5 text-left">
      <h3 className="mb-1 font-bold">{item.name}</h3>
      <p className="truncate text-sm text-muted-foreground">{item.content}</p>
    </div>
  );
}
