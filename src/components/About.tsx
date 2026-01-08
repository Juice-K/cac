import { Heart, Calendar, MapPin, Shield } from "lucide-react";

const stats = [
  { icon: Heart, value: "100%", label: "Free Services" },
  { icon: Calendar, value: "Weekly", label: "Programs Available" },
  { icon: MapPin, value: "Local", label: "Community Focus" },
  { icon: Shield, value: "Veteran", label: "Friendly" },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">About Us</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3 mb-6">
              Uplifting Communities and the Veterans who Served Them
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Community Advancement Collective was founded on the belief that everyone deserves a brighter future and
              access to essential services, regardless of their circumstances. We are a dedicated group of volunteers
              and professionals committed to uplifting our neighbors and building strong communities person by person.
            </p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Our mission is simple: remove barriers and create pathways to success. Whether it's a GED, a job,
              advocacy, or just some food, we're here to provide whatever unlocks the door to the next level in life.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Our Promise</h3>
                <p className="text-muted-foreground">
                  Every person we serve is treated with dignity, respect, and compassion.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/30 rounded-2xl blur-xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
