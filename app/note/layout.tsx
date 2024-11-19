import Sidebar from "@/components/sidebar/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      className="flex-1"
      style={{
        background:
          "linear-gradient(114deg, #000 -6.94%, #000 13.24%, #302B3D 88.6%, #7B6368 108.23%)",
      }}
    >
      <Sidebar />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}
