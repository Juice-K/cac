import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, GraduationCap, BriefcaseBusiness, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "Mobile Food Pantry",
    description: "Dedicated to our veterans",
    features: ["Regular Food Distribution", "Emergency meal assistance", "Cooking Classes"],
    serviceType: "food",
  },
  {
    icon: GraduationCap,
    title: "Free GED Classes",
    description: "Custom, comprehensive GED preparation program. All literacy levels welcome.",
    features: ["Flexible scheduling", "Judgement-free", "Study materials provided"],
    serviceType: "ged",
  },
  {
    icon: BriefcaseBusiness,
    title: "Career Development",
    description: "Skills, guidance, and advocacy to put you in position for success.",
    features: ["All Are Welcome", "Strategic Career Planning", "Placement Assistance"],
    serviceType: "career",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">What We Offer</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">Our Core Services</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every service we provide is completely free, ensuring everyone has access to the support they need to
            advance in life.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md bg-card flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2 flex-1">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/get-help" className="mt-6">
                  <Button variant="ghost" className="w-full group/btn">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA to volunteer */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Want to help provide these services?</p>
          <Link to="/support">
            <Button variant="outline" size="lg">
              Become a Volunteer
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
