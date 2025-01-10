import Footer from "@/app/components/ui/footer";
import Header from "@/app/components/ui/header";
import NewsletterSection from "@/app/components/ui/sections/news-letter";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Header />
      {children}
      <NewsletterSection />
      <div className="bg-[#1C1C1C]">
        <Footer />
      </div>
    </main>
  );
}
