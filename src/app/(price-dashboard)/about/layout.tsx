import Footer from "@/app/components/ui/footer";
import Header from "@/app/components/ui/header";

export default function PriceDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Header />
      {children}
      <div className="relative z-10 -mt-[400px] [&_footer_p]:!text-white/70 [&_footer_a]:!text-white/70 [&_footer_a:hover]:!text-white [&_footer_a:hover]:!drop-shadow-[0_0_8px_rgba(0,229,255,0.5)] [&_footer_h3]:!text-white [&_footer]:!border-white/10 [&_footer>div>div:last-child]:!border-white/10">
        <Footer />
      </div>
    </main>
  );
}
