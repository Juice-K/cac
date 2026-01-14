import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Header />
      <main className="pt-16 md:pt-20">
        <Hero />
        <Services />
        <About />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
