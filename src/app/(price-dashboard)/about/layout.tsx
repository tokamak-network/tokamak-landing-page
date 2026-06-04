import Footer from "@/app/components/ui/footer";
import Header from "@/app/components/ui/header";

export default function PriceDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-black min-h-screen text-white">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
