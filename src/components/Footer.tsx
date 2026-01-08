import { Heart, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-background py-16">
      <div className="container px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">CAC</span>
              </div>
              <div>
                <div className="font-bold text-background leading-tight">Community Advancement Collective</div>
              </div>
            </div>
            <p className="text-background/70 mb-6 max-w-sm">
              Empowering our community through free essential services. 
              Together, we can build a stronger, more supportive neighborhood.
            </p>
            <div className="flex items-center gap-2 text-accent">
              <Heart className="w-4 h-4" />
              <span className="text-sm">A 501(c)(3) Non-Profit Organization</span>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-background mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-background/70">
                <MapPin className="w-5 h-5 mt-0.5 text-primary" />
                <span>123 Community Way<br />Your City, ST 12345</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+1234567890" className="hover:text-background transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:info@cacfla.org" className="hover:text-background transition-colors">
                  info@cacfla.org
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-bold text-background mb-4">Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-background/70">
                <Clock className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <div className="font-medium text-background">Mon - Fri</div>
                  <div>9:00 AM - 5:00 PM</div>
                </div>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <Clock className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <div className="font-medium text-background">Saturday</div>
                  <div>10:00 AM - 2:00 PM</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-background/50 text-sm">
          <p>© {new Date().getFullYear()} Community Advancement Collective. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
