import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, HelpCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Page Not Found" 
        description="The page you're looking for doesn't exist. Return to the Community Advancement Collective homepage to find what you need."
      />
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-20">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Display */}
            <div className="mb-8">
              <h1 className="text-8xl md:text-9xl font-bold text-primary/20 select-none">404</h1>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Page Not Found
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg">
                <Link to="/">
                  <Home className="mr-2 w-4 h-4" />
                  Go to Homepage
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/get-help">
                  <HelpCircle className="mr-2 w-4 h-4" />
                  Get Help
                </Link>
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="border-t border-border pt-8">
              <p className="text-sm text-muted-foreground mb-4">Or try one of these pages:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/events" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Events
                </Link>
                <Link 
                  to="/support" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Volunteer & Donate
                </Link>
                <Link 
                  to="/join" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Join the Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
