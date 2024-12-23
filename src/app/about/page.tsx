import About from "../components/ui/sections/about";
import Header from "../components/ui/header";
import NewsletterSection from "../components/ui/sections/news-letter";
import Footer from "../components/ui/footer";
export default function AboutPage() {
  return (
    <main>
      <Header />
      <About />
      <NewsletterSection />
      <div className="bg-[#1C1C1C]">
        <Footer />
      </div>
    </main>
  );
}
