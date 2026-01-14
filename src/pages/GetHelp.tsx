import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, GraduationCap, Briefcase, UtensilsCrossed, Shield, CheckCircle, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { submitHelpRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { contactInfoSchema, gedFieldsSchema, careerFieldsSchema, foodFieldsSchema, validateForm } from "@/lib/validations";

type ServiceType = "ged" | "career" | "food" | null;

interface FormData {
  // Common fields
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  
  // GED fields
  currentEducation: string;
  desiredGradDate: string;
  strongestSubject: string;
  weakestSubject: string;
  studyAvailability: string;
  gedGoals: string;
  
  // Career fields
  desiredJob: string;
  shortTermGoals: string;
  midTermGoals: string;
  longTermGoals: string;
  currentQualifications: string;
  perceivedNeeds: string;
  
  // Food fields (veterans only)
  veteranBranch: string;
  veteranStatus: string;
  householdSize: string;
  dietaryRestrictions: string;
  foodNeeds: string;
  preferredPickupLocation: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  currentEducation: "",
  desiredGradDate: "",
  strongestSubject: "",
  weakestSubject: "",
  studyAvailability: "",
  gedGoals: "",
  desiredJob: "",
  shortTermGoals: "",
  midTermGoals: "",
  longTermGoals: "",
  currentQualifications: "",
  perceivedNeeds: "",
  veteranBranch: "",
  veteranStatus: "",
  householdSize: "",
  dietaryRestrictions: "",
  foodNeeds: "",
  preferredPickupLocation: "",
};

const GetHelp = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setStep(2);
  };

  const validateStep2 = () => {
    const result = validateForm(contactInfoSchema, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
    });

    if (result.success === false) {
      setErrors(result.errors);
      toast({
        title: "Please fix the errors",
        description: "Some fields need your attention.",
        variant: "destructive",
      });
      return false;
    }
    
    setErrors({});
    return true;
  };

  const validateStep3 = () => {
    let schema;
    let data;

    if (selectedService === "ged") {
      schema = gedFieldsSchema;
      data = {
        currentEducation: formData.currentEducation,
        desiredGradDate: formData.desiredGradDate,
        strongestSubject: formData.strongestSubject,
        weakestSubject: formData.weakestSubject,
        studyAvailability: formData.studyAvailability,
        gedGoals: formData.gedGoals,
      };
    } else if (selectedService === "career") {
      schema = careerFieldsSchema;
      data = {
        desiredJob: formData.desiredJob,
        shortTermGoals: formData.shortTermGoals,
        midTermGoals: formData.midTermGoals,
        longTermGoals: formData.longTermGoals,
        currentQualifications: formData.currentQualifications,
        perceivedNeeds: formData.perceivedNeeds,
      };
    } else if (selectedService === "food") {
      schema = foodFieldsSchema;
      data = {
        veteranBranch: formData.veteranBranch,
        veteranStatus: formData.veteranStatus,
        householdSize: formData.householdSize,
        dietaryRestrictions: formData.dietaryRestrictions,
        foodNeeds: formData.foodNeeds,
        preferredPickupLocation: formData.preferredPickupLocation,
      };
    } else {
      return true;
    }

    const result = validateForm(schema, data);

    if (result.success === false) {
      setErrors(result.errors);
      toast({
        title: "Please fix the errors",
        description: "Some required fields are missing.",
        variant: "destructive",
      });
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleContinueToStep3 = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setIsSubmitting(true);
    // Build service-specific details based on selected service
    let serviceDetails: Record<string, string> = {};
    
    if (selectedService === "ged") {
      serviceDetails = {
        currentEducation: formData.currentEducation,
        desiredGradDate: formData.desiredGradDate,
        strongestSubject: formData.strongestSubject,
        weakestSubject: formData.weakestSubject,
        studyAvailability: formData.studyAvailability,
        gedGoals: formData.gedGoals,
      };
    } else if (selectedService === "career") {
      serviceDetails = {
        desiredJob: formData.desiredJob,
        shortTermGoals: formData.shortTermGoals,
        midTermGoals: formData.midTermGoals,
        longTermGoals: formData.longTermGoals,
        currentQualifications: formData.currentQualifications,
        perceivedNeeds: formData.perceivedNeeds,
      };
    } else if (selectedService === "food") {
      serviceDetails = {
        veteranBranch: formData.veteranBranch,
        veteranStatus: formData.veteranStatus,
        householdSize: formData.householdSize,
        dietaryRestrictions: formData.dietaryRestrictions,
        foodNeeds: formData.foodNeeds,
        preferredPickupLocation: formData.preferredPickupLocation,
      };
    }

    try {
      const result = await submitHelpRequest({
        service_type: selectedService || '',
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        service_details: serviceDetails,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        toast({
          title: "Submission Error",
          description: result.error || "Failed to submit your request. Please try again.",
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container px-4 max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Request Submitted!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for reaching out to Community Advancement Collective. Our team will review your request and
              contact you within 2-3 business days.
            </p>
            <Link to="/">
              <Button size="lg">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Return Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Get Help" 
        description="Request assistance with GED preparation, career development, or food assistance for veterans. Community Advancement Collective is here to help Orlando residents."
      />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && <div className={`w-16 h-1 rounded ${step > s ? "bg-primary" : "bg-muted"}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How Can We Help You?</h1>
                <p className="text-lg text-muted-foreground">Select the service that best fits your needs.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary group"
                  onClick={() => handleServiceSelect("ged")}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <GraduationCap className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>GED Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      Free GED preparation classes and testing support to help you earn your high school equivalency.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary group"
                  onClick={() => handleServiceSelect("career")}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Briefcase className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>Career Development</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      Resume building, job search assistance, and career planning to help you reach your goals.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary group"
                  onClick={() => handleServiceSelect("food")}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <div className="relative">
                        <UtensilsCrossed className="w-8 h-8 text-accent" />
                        <Shield className="w-4 h-4 text-accent absolute -bottom-1 -right-1" />
                      </div>
                    </div>
                    <CardTitle>Food Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      Food assistance for veterans and their families. Thank you for your service.
                      <span className="block mt-2 text-xs font-semibold text-accent">Veterans Only</span>
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-10 text-center">
                <Link to="/">
                  <Button variant="ghost">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Tell Us About Yourself</h1>
                <p className="text-lg text-muted-foreground">
                  Please provide your contact information so we can reach you.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        placeholder="John"
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
                        onChange={(e) => updateField("lastName", e.target.value)}
                        placeholder="Doe"
                        className={errors.lastName ? "border-destructive" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="john@example.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        placeholder="Orlando"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => updateField("state", e.target.value)}
                          placeholder="FL"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          value={formData.zip}
                          onChange={(e) => updateField("zip", e.target.value)}
                          placeholder="32801"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>
                <Button onClick={handleContinueToStep3}>
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Service-Specific Questions */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {selectedService === "ged" && "GED Program Details"}
                  {selectedService === "career" && "Career Development Details"}
                  {selectedService === "food" && "Food Assistance Details"}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Help us understand your specific needs so we can better assist you.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  {/* GED-specific fields */}
                  {selectedService === "ged" && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentEducation">Current Education Level *</Label>
                        <Select
                          value={formData.currentEducation}
                          onValueChange={(value) => updateField("currentEducation", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your current education level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No formal education</SelectItem>
                            <SelectItem value="elementary">Elementary school</SelectItem>
                            <SelectItem value="middle">Middle school</SelectItem>
                            <SelectItem value="some-high">Some high school</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="desiredGradDate">When would you like to complete your GED?</Label>
                        <Select
                          value={formData.desiredGradDate}
                          onValueChange={(value) => updateField("desiredGradDate", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select target timeframe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3-months">Within 3 months</SelectItem>
                            <SelectItem value="6-months">Within 6 months</SelectItem>
                            <SelectItem value="1-year">Within 1 year</SelectItem>
                            <SelectItem value="flexible">Flexible / No rush</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="strongestSubject">Strongest Subject</Label>
                          <Select
                            value={formData.strongestSubject}
                            onValueChange={(value) => updateField("strongestSubject", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="math">Mathematics</SelectItem>
                              <SelectItem value="reading">Reading/Language Arts</SelectItem>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="social">Social Studies</SelectItem>
                              <SelectItem value="unsure">Not sure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weakestSubject">Subject Needing Most Help</Label>
                          <Select
                            value={formData.weakestSubject}
                            onValueChange={(value) => updateField("weakestSubject", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="math">Mathematics</SelectItem>
                              <SelectItem value="reading">Reading/Language Arts</SelectItem>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="social">Social Studies</SelectItem>
                              <SelectItem value="unsure">Not sure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="studyAvailability">When are you available to study?</Label>
                        <Select
                          value={formData.studyAvailability}
                          onValueChange={(value) => updateField("studyAvailability", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekday-morning">Weekday mornings</SelectItem>
                            <SelectItem value="weekday-afternoon">Weekday afternoons</SelectItem>
                            <SelectItem value="weekday-evening">Weekday evenings</SelectItem>
                            <SelectItem value="weekend">Weekends</SelectItem>
                            <SelectItem value="flexible">Flexible schedule</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gedGoals">What are your goals after getting your GED?</Label>
                        <Textarea
                          id="gedGoals"
                          value={formData.gedGoals}
                          onChange={(e) => updateField("gedGoals", e.target.value)}
                          placeholder="Tell us about your plans - college, career, personal achievement, etc."
                          rows={4}
                        />
                      </div>
                    </div>
                  )}

                  {/* Career-specific fields */}
                  {selectedService === "career" && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="desiredJob">What type of job are you looking for? *</Label>
                        <Input
                          id="desiredJob"
                          value={formData.desiredJob}
                          onChange={(e) => updateField("desiredJob", e.target.value)}
                          placeholder="e.g., Office Administrator, Warehouse Manager, IT Support"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shortTermGoals">Short-term Career Goals (next 6 months)</Label>
                        <Textarea
                          id="shortTermGoals"
                          value={formData.shortTermGoals}
                          onChange={(e) => updateField("shortTermGoals", e.target.value)}
                          placeholder="What do you want to achieve in the next 6 months?"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="midTermGoals">Mid-term Career Goals (1-2 years)</Label>
                        <Textarea
                          id="midTermGoals"
                          value={formData.midTermGoals}
                          onChange={(e) => updateField("midTermGoals", e.target.value)}
                          placeholder="Where do you see yourself in 1-2 years?"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="longTermGoals">Long-term Career Goals (5+ years)</Label>
                        <Textarea
                          id="longTermGoals"
                          value={formData.longTermGoals}
                          onChange={(e) => updateField("longTermGoals", e.target.value)}
                          placeholder="What's your ultimate career aspiration?"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentQualifications">Current Qualifications & Experience</Label>
                        <Textarea
                          id="currentQualifications"
                          value={formData.currentQualifications}
                          onChange={(e) => updateField("currentQualifications", e.target.value)}
                          placeholder="List your current skills, certifications, work experience, etc."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="perceivedNeeds">What help do you need most?</Label>
                        <Textarea
                          id="perceivedNeeds"
                          value={formData.perceivedNeeds}
                          onChange={(e) => updateField("perceivedNeeds", e.target.value)}
                          placeholder="Resume writing, interview skills, job search, networking, training, etc."
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  {/* Food-specific fields (Veterans Only) */}
                  {selectedService === "food" && (
                    <div className="space-y-6">
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-accent font-semibold mb-2">
                          <Shield className="w-5 h-5" />
                          Veterans Food Assistance Program
                        </div>
                        <p className="text-sm text-muted-foreground">
                          This program is available exclusively to veterans and their immediate families. Thank you for
                          your service to our country.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="veteranBranch">Branch of Service *</Label>
                          <Select
                            value={formData.veteranBranch}
                            onValueChange={(value) => updateField("veteranBranch", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="army">U.S. Army</SelectItem>
                              <SelectItem value="navy">U.S. Navy</SelectItem>
                              <SelectItem value="airforce">U.S. Air Force</SelectItem>
                              <SelectItem value="marines">U.S. Marine Corps</SelectItem>
                              <SelectItem value="coastguard">U.S. Coast Guard</SelectItem>
                              <SelectItem value="spaceforce">U.S. Space Force</SelectItem>
                              <SelectItem value="national-guard">National Guard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="veteranStatus">Veteran Status *</Label>
                          <Select
                            value={formData.veteranStatus}
                            onValueChange={(value) => updateField("veteranStatus", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="veteran">Veteran</SelectItem>
                              <SelectItem value="active">Active Duty</SelectItem>
                              <SelectItem value="reserve">Reserve</SelectItem>
                              <SelectItem value="family">Veteran Family Member</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="householdSize">Household Size *</Label>
                        <Select
                          value={formData.householdSize}
                          onValueChange={(value) => updateField("householdSize", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="How many people in your household?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 person</SelectItem>
                            <SelectItem value="2">2 people</SelectItem>
                            <SelectItem value="3-4">3-4 people</SelectItem>
                            <SelectItem value="5-6">5-6 people</SelectItem>
                            <SelectItem value="7+">7 or more people</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dietaryRestrictions">Any Dietary Restrictions or Allergies?</Label>
                        <Input
                          id="dietaryRestrictions"
                          value={formData.dietaryRestrictions}
                          onChange={(e) => updateField("dietaryRestrictions", e.target.value)}
                          placeholder="e.g., Gluten-free, vegetarian, nut allergy, diabetic-friendly"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="foodNeeds">Describe Your Specific Needs</Label>
                        <Textarea
                          id="foodNeeds"
                          value={formData.foodNeeds}
                          onChange={(e) => updateField("foodNeeds", e.target.value)}
                          placeholder="Tell us about your situation and what type of food assistance would help most."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preferredPickupLocation">Preferred Pickup Location/Area</Label>
                        <Input
                          id="preferredPickupLocation"
                          value={formData.preferredPickupLocation}
                          onChange={(e) => updateField("preferredPickupLocation", e.target.value)}
                          placeholder="e.g., Downtown Orlando, East Orange County"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between mt-8">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Request
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GetHelp;
