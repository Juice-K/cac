import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Whether you need assistance or want to help, we're here for you. Reach out today and become part of our
            community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/get-help">
              <Button variant="secondary" size="lg" className="group">
                Request Services
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Volunteer or Donate
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-primary-foreground/90">
            <a
              href="tel:+14078931893"
              className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>(407) 893-1893</span>
            </a>
            <a
              href="mailto:info@cacfla.org"
              className="flex items-center gap-2 hover:text-primary-foreground transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>info@cacfla.org</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
