import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: "food" | "education" | "veterans" | "community";
  recurring?: string;
}

// Edit this array to add, remove, or update events
const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Community Food Distribution",
    date: "Every Saturday",
    time: "10:00 AM - 1:00 PM",
    location: "1317 Edgewater Dr, Orlando, FL",
    description: "Free groceries and fresh produce for families in need. No registration required.",
    category: "food",
    recurring: "Weekly",
  },
  {
    id: 2,
    title: "GED Preparation Class",
    date: "Mondays & Wednesdays",
    time: "6:00 PM - 8:00 PM",
    location: "1317 Edgewater Dr, Orlando, FL",
    description: "Free GED prep classes covering all subjects. Materials provided.",
    category: "education",
    recurring: "Weekly",
  },
  {
    id: 3,
    title: "Veterans Resource Day",
    date: "First Friday of Each Month",
    time: "9:00 AM - 3:00 PM",
    location: "1317 Edgewater Dr, Orlando, FL",
    description: "Connect with VA representatives, job counselors, and community resources.",
    category: "veterans",
    recurring: "Monthly",
  },
  {
    id: 4,
    title: "Community Wellness Workshop",
    date: "January 25, 2025",
    time: "11:00 AM - 2:00 PM",
    location: "1317 Edgewater Dr, Orlando, FL",
    description: "Free health screenings, nutrition education, and wellness resources.",
    category: "community",
  },
  {
    id: 5,
    title: "Job Skills Training Session",
    date: "February 1, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "1317 Edgewater Dr, Orlando, FL",
    description: "Resume writing, interview skills, and job search strategies.",
    category: "community",
  },
];

const categoryStyles = {
  food: "bg-green-100 text-green-800 border-green-200",
  education: "bg-blue-100 text-blue-800 border-blue-200",
  veterans: "bg-amber-100 text-amber-800 border-amber-200",
  community: "bg-purple-100 text-purple-800 border-purple-200",
};

const categoryLabels = {
  food: "Food Services",
  education: "Education",
  veterans: "Veterans",
  community: "Community",
};

const Events = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Upcoming Events</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Events & Programs
              </h1>
              <p className="text-lg text-muted-foreground">
                Join us for free community events, classes, and services. All are welcome!
              </p>
            </div>
          </div>
        </section>

        {/* Events List */}
        <section className="py-16">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              {/* Category Legend */}
              <div className="flex flex-wrap gap-3 mb-8 justify-center">
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <Badge 
                    key={key} 
                    variant="outline" 
                    className={categoryStyles[key as keyof typeof categoryStyles]}
                  >
                    {label}
                  </Badge>
                ))}
              </div>

              {/* Events */}
              <div className="space-y-6">
                {upcomingEvents.map((event) => (
                  <article 
                    key={event.id}
                    className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Date/Time Column */}
                      <div className="md:w-48 flex-shrink-0">
                        <div className="flex items-center gap-2 text-primary font-semibold mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        {event.recurring && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {event.recurring}
                          </Badge>
                        )}
                      </div>

                      {/* Content Column */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-xl font-bold text-foreground">
                            {event.title}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className={`${categoryStyles[event.category]} flex-shrink-0`}
                          >
                            {categoryLabels[event.category]}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Call to Action */}
              <div className="mt-12 text-center p-8 bg-primary/5 rounded-xl border border-primary/10">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Want to Host an Event?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Partner with us to bring resources to your community.
                </p>
                <a 
                  href="mailto:info@cacfla.org" 
                  className="text-primary font-medium hover:underline"
                >
                  Contact us at info@cacfla.org
                </a>
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
