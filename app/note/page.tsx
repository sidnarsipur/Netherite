import Breadcrumb from "@/components/note/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-start gap-5 p-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <Breadcrumb />
      </div>
      <div className="w-full rounded-xl border border-slate-500 bg-gray-950">
        <h1 className="p-5 text-2xl font-bold">Note Title</h1>
        <Separator />
        <p className="p-5">sfef sefse</p>
      </div>
    </div>
  );
}
