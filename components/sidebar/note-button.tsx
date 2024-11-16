import { Note } from "@/lib/definitions";
import Link from "next/link";
import FancyCard from "../fancy-card";

export default function NoteButton({ item }: { item: Note }) {
  return (
    <Link href={`/note/${item.id}`}>
      <FancyCard>
        <h3 className="mb-1 font-bold">{item.name}</h3>
        <p className="truncate text-sm text-muted-foreground">{item.content}</p>
      </FancyCard>
    </Link>
  );
}
