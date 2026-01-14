import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Users, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { z } from "zod";

const communitySchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^[\d\s\-\(\)\+]+$/, "Please enter a valid phone number").min(10, "Phone number must be at least 10 digits"),
  wantsNotifications: z.boolean(),
  contactPreference: z.enum(["email", "text", "both"]),
});

type CommunityFormData = z.infer<typeof communitySchema>;

const JoinCommunity = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CommunityFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    wantsNotifications: true,
    contactPreference: "email",
  });

  const handleInputChange = (field: keyof CommunityFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = communitySchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Welcome to the Community!",
      description: "Thank you for joining. We'll keep you updated on CAC news and events.",
    });

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      wantsNotifications: true,
      contactPreference: "email",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container px-4 max-w-2xl mx-auto">
          {/* Back Link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Join the Community
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Stay connected with CAC and be the first to know about events, programs, and ways to get involved.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Enter your first name"
                  className={errors.firstName ? "border-destructive" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Enter your last name"
                  className={errors.lastName ? "border-destructive" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your@email.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            {/* Notifications Checkbox */}
            <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
              <Checkbox
                id="notifications"
                checked={formData.wantsNotifications}
                onCheckedChange={(checked) => handleInputChange("wantsNotifications", checked as boolean)}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <Label htmlFor="notifications" className="font-medium cursor-pointer">
                  Yes, I want to receive CAC news and updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about upcoming events, volunteer opportunities, and community news.
                </p>
              </div>
            </div>

            {/* Contact Preference */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Preferred Contact Method</Label>
              <RadioGroup
                value={formData.contactPreference}
                onValueChange={(value) => handleInputChange("contactPreference", value)}
                className="grid gap-3"
              >
                <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="email" id="contact-email" />
                  <Label htmlFor="contact-email" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email only
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="text" id="contact-text" />
                  <Label htmlFor="contact-text" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Text message only
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="both" id="contact-both" />
                  <Label htmlFor="contact-both" className="flex items-center gap-2 cursor-pointer flex-1">
                    <span className="flex gap-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </span>
                    Both email and text
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Joining..." : "Join the Community"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              We respect your privacy and will never share your information with third parties.
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JoinCommunity;
