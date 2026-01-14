import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Calendar, Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Events = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Events" 
        description="Stay updated on upcoming community events, GED classes, career workshops, and food assistance programs in Orlando, FL."
      />
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Events & Programs</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Events Coming Soon
              </h1>
              <p className="text-lg text-muted-foreground">
                We're working on exciting community events, classes, and services. Check back soon!
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon Content */}
        <section className="py-16">
          <div className="container px-4">
            <div className="max-w-2xl mx-auto text-center">
              {/* Coming Soon Card */}
              <div className="bg-card border border-border rounded-2xl p-12 shadow-sm mb-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  No Events Scheduled Yet
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We're currently planning our upcoming events and programs. Soon you'll find information about our community food distributions, GED classes, veterans services, and more.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link to="/join">Get Notified</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="mailto:info@cacfla.org">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Us
                    </a>
                  </Button>
                </div>
              </div>

              {/* What to Expect */}
              <div className="text-left bg-muted/30 rounded-xl p-8">
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">
                  What to Expect
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span><strong className="text-foreground">Food Distributions</strong> – Free groceries and fresh produce for families in need</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span><strong className="text-foreground">GED Classes</strong> – Free preparation courses and testing support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span><strong className="text-foreground">Veterans Services</strong> – Resources and support for those who served</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span><strong className="text-foreground">Career Workshops</strong> – Resume building, interview skills, and job search help</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
