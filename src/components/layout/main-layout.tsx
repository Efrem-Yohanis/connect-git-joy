import { TopNavbar } from "./top-navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <TopNavbar />
      
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}