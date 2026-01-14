import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Heart, HandHeart, DollarSign, Check, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { submitVolunteerApplication, submitDonation } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { volunteerSchema, donationSchema, validateForm } from "@/lib/validations";

type SupportType = "volunteer" | "donate" | null;
type VolunteerService = "food-pantry" | "ged-classes" | "career-development" | null;

const SupportMission = () => {
  const [step, setStep] = useState(1);
  const [supportType, setSupportType] = useState<SupportType>(null);
  const [volunteerService, setVolunteerService] = useState<VolunteerService>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const [volunteerInfo, setVolunteerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    availability: [] as string[],
    experience: "",
    message: "",
  });
  const [donationInfo, setDonationInfo] = useState({
    amount: "",
    customAmount: "",
    paymentMethod: "",
    name: "",
    email: "",
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const updateVolunteerField = (field: string, value: string | string[]) => {
    setVolunteerInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateDonationField = (field: string, value: string) => {
    setDonationInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    const newAvailability = checked
      ? [...volunteerInfo.availability, day]
      : volunteerInfo.availability.filter((d) => d !== day);
    updateVolunteerField("availability", newAvailability);
  };

  const handleVolunteerSubmit = async () => {
    const result = validateForm(volunteerSchema, volunteerInfo);
    
    if (result.success === false) {
      setErrors(result.errors);
      toast({
        title: "Please fix the errors",
        description: "Some fields need your attention.",
        variant: "destructive",
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const apiResult = await submitVolunteerApplication({
        name: volunteerInfo.name,
        email: volunteerInfo.email,
        phone: volunteerInfo.phone,
        service_area: volunteerService || '',
        availability: volunteerInfo.availability,
        experience: volunteerInfo.experience,
        message: volunteerInfo.message,
      });

      if (apiResult.success) {
        handleNext();
      } else {
        toast({
          title: "Submission Error",
          description: apiResult.error || "Failed to submit your application. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonationSubmit = async () => {
    const finalAmount = donationInfo.amount === "Custom" 
      ? donationInfo.customAmount 
      : donationInfo.amount;
    
    const result = validateForm(donationSchema, {
      name: donationInfo.name,
      email: donationInfo.email,
      amount: finalAmount,
      paymentMethod: donationInfo.paymentMethod,
    });
    
    if (result.success === false) {
      setErrors(result.errors);
      toast({
        title: "Please fix the errors",
        description: "Some fields need your attention.",
        variant: "destructive",
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const apiResult = await submitDonation({
        name: donationInfo.name,
        email: donationInfo.email,
        amount: finalAmount,
        payment_method: donationInfo.paymentMethod,
      });

      if (apiResult.success) {
        handleNext();
      } else {
        toast({
          title: "Submission Error",
          description: apiResult.error || "Failed to record your donation. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const totalSteps = supportType === "volunteer" ? 4 : supportType === "donate" ? 3 : 1;
    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i + 1 <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          How Would You Like to Help?
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Your support makes a real difference in our community. Choose how you'd like to contribute.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
            supportType === "volunteer" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setSupportType("volunteer")}
        >
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <HandHeart className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Volunteer</CardTitle>
            <CardDescription>Give your time and skills</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            Help us serve our community by volunteering with one of our programs.
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
            supportType === "donate" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setSupportType("donate")}
        >
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-accent" />
            </div>
            <CardTitle>Donate</CardTitle>
            <CardDescription>Make a financial contribution</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            Your donation helps fund our programs and reach more people in need.
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-6">
        <Button onClick={handleNext} disabled={!supportType} size="lg" className="group">
          Continue
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );

  const renderVolunteerStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Which Service Area Interests You?
        </h2>
        <p className="text-muted-foreground">
          Select the program you'd like to volunteer with.
        </p>
      </div>

      <RadioGroup
        value={volunteerService || ""}
        onValueChange={(value) => setVolunteerService(value as VolunteerService)}
        className="grid gap-4 max-w-xl mx-auto"
      >
        <Label
          htmlFor="food-pantry"
          className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
            volunteerService === "food-pantry" ? "border-primary bg-primary/5" : ""
          }`}
        >
          <RadioGroupItem value="food-pantry" id="food-pantry" />
          <div>
            <div className="font-semibold">Mobile Food Pantry</div>
            <div className="text-sm text-muted-foreground">
              Help with food distribution, sorting, and community outreach
            </div>
          </div>
        </Label>

        <Label
          htmlFor="ged-classes"
          className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
            volunteerService === "ged-classes" ? "border-primary bg-primary/5" : ""
          }`}
        >
          <RadioGroupItem value="ged-classes" id="ged-classes" />
          <div>
            <div className="font-semibold">GED Classes</div>
            <div className="text-sm text-muted-foreground">
              Tutor students, assist with materials, or provide administrative support
            </div>
          </div>
        </Label>

        <Label
          htmlFor="career-development"
          className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
            volunteerService === "career-development" ? "border-primary bg-primary/5" : ""
          }`}
        >
          <RadioGroupItem value="career-development" id="career-development" />
          <div>
            <div className="font-semibold">Career Development</div>
            <div className="text-sm text-muted-foreground">
              Mentor job seekers, review resumes, or conduct mock interviews
            </div>
          </div>
        </Label>
      </RadioGroup>

      <div className="flex justify-center gap-4 pt-6">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={!volunteerService}>
          Continue
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderVolunteerStep3 = () => (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Tell Us About Yourself
        </h2>
        <p className="text-muted-foreground">
          Share your details and availability so we can get in touch.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={volunteerInfo.name}
              onChange={(e) => updateVolunteerField("name", e.target.value)}
              placeholder="Your name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={volunteerInfo.email}
              onChange={(e) => updateVolunteerField("email", e.target.value)}
              placeholder="your@email.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={volunteerInfo.phone}
            onChange={(e) => updateVolunteerField("phone", e.target.value)}
            placeholder="(555) 123-4567"
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Availability *</Label>
          <p className="text-sm text-muted-foreground mb-2">Select all days you're available</p>
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 ${errors.availability ? "ring-1 ring-destructive rounded-md p-1" : ""}`}>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
              (day) => (
                <Label
                  key={day}
                  className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted/50"
                >
                  <Checkbox
                    checked={volunteerInfo.availability.includes(day)}
                    onCheckedChange={(checked) => handleAvailabilityChange(day, checked as boolean)}
                  />
                  <span className="text-sm">{day}</span>
                </Label>
              )
            )}
          </div>
          {errors.availability && (
            <p className="text-sm text-destructive">{errors.availability}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Relevant Experience</Label>
          <Textarea
            id="experience"
            value={volunteerInfo.experience}
            onChange={(e) => updateVolunteerField("experience", e.target.value)}
            placeholder="Tell us about any relevant skills or experience..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Additional Message</Label>
          <Textarea
            id="message"
            value={volunteerInfo.message}
            onChange={(e) => updateVolunteerField("message", e.target.value)}
            placeholder="Anything else you'd like us to know?"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleVolunteerSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <Check className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderDonateStep2 = () => (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Make a Donation
        </h2>
        <p className="text-muted-foreground">
          Choose an amount and payment method that works for you.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Donation Amount *</Label>
          <div className={`grid grid-cols-3 gap-3 ${errors.amount ? "ring-1 ring-destructive rounded-md p-1" : ""}`}>
            {["$25", "$50", "$100", "$250", "$500", "Custom"].map((amount) => (
              <Button
                key={amount}
                variant={donationInfo.amount === amount ? "default" : "outline"}
                onClick={() => updateDonationField("amount", amount)}
                className="h-12"
              >
                {amount}
              </Button>
            ))}
          </div>
          {errors.amount && (
            <p className="text-sm text-destructive">{errors.amount}</p>
          )}
          {donationInfo.amount === "Custom" && (
            <div className="pt-2">
              <Input
                type="number"
                placeholder="Enter amount"
                value={donationInfo.customAmount}
                onChange={(e) => updateDonationField("customAmount", e.target.value)}
                className="text-lg"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Payment Method *</Label>
          <RadioGroup
            value={donationInfo.paymentMethod}
            onValueChange={(value) => updateDonationField("paymentMethod", value)}
            className={`grid gap-3 ${errors.paymentMethod ? "ring-1 ring-destructive rounded-md p-1" : ""}`}
          >
            {[
              { value: "card", label: "Credit/Debit Card" },
              { value: "paypal", label: "PayPal" },
              { value: "venmo", label: "Venmo" },
              { value: "zelle", label: "Zelle" },
              { value: "check", label: "Mail a Check" },
            ].map((method) => (
              <Label
                key={method.value}
                htmlFor={method.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                  donationInfo.paymentMethod === method.value ? "border-primary bg-primary/5" : ""
                }`}
              >
                <RadioGroupItem value={method.value} id={method.value} />
                <span>{method.label}</span>
              </Label>
            ))}
          </RadioGroup>
          {errors.paymentMethod && (
            <p className="text-sm text-destructive">{errors.paymentMethod}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="donor-name">Your Name</Label>
            <Input
              id="donor-name"
              value={donationInfo.name}
              onChange={(e) => updateDonationField("name", e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donor-email">Email</Label>
            <Input
              id="donor-email"
              type="email"
              value={donationInfo.email}
              onChange={(e) => updateDonationField("email", e.target.value)}
              placeholder="For receipt"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleDonationSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Continue to Payment
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6 max-w-lg mx-auto">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Heart className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
        Thank You for Your Support!
      </h2>
      <p className="text-muted-foreground">
        {supportType === "volunteer"
          ? "We've received your volunteer application. Our team will reach out to you soon to discuss next steps."
          : "We appreciate your generous donation. You'll receive a confirmation email shortly with payment instructions."}
      </p>
      <Link to="/">
        <Button size="lg">Return Home</Button>
      </Link>
    </div>
  );

  const renderCurrentStep = () => {
    if (step === 1) return renderStep1();

    if (supportType === "volunteer") {
      if (step === 2) return renderVolunteerStep2();
      if (step === 3) return renderVolunteerStep3();
      if (step === 4) return renderSuccessStep();
    }

    if (supportType === "donate") {
      if (step === 2) return renderDonateStep2();
      if (step === 3) return renderSuccessStep();
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            {step > 1 && renderStepIndicator()}
            {renderCurrentStep()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SupportMission;
