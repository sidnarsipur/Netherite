import Sidebar from "@/components/sidebar/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="bg-background-gradient flex-1">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}
