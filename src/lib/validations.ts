import { z } from "zod";

// Phone number regex - accepts formats like (555) 123-4567, 555-123-4567, 5551234567
const phoneRegex = /^[\d\s\-\(\)\.+]{10,20}$/;

// Common validation schemas
export const contactInfoSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Please enter a valid phone number"),
  address: z.string().trim().max(200, "Address must be less than 200 characters").optional(),
  city: z.string().trim().max(100, "City must be less than 100 characters").optional(),
  state: z.string().trim().max(50, "State must be less than 50 characters").optional(),
  zip: z.string().trim().max(20, "ZIP code must be less than 20 characters").optional(),
});

// Help request service-specific schemas
export const gedFieldsSchema = z.object({
  currentEducation: z.string().min(1, "Please select your current education level"),
  desiredGradDate: z.string().optional(),
  strongestSubject: z.string().optional(),
  weakestSubject: z.string().optional(),
  studyAvailability: z.string().optional(),
  gedGoals: z.string().max(1000, "Goals must be less than 1000 characters").optional(),
});

export const careerFieldsSchema = z.object({
  desiredJob: z.string().max(200, "Job title must be less than 200 characters").optional(),
  shortTermGoals: z.string().max(500, "Goals must be less than 500 characters").optional(),
  midTermGoals: z.string().max(500, "Goals must be less than 500 characters").optional(),
  longTermGoals: z.string().max(500, "Goals must be less than 500 characters").optional(),
  currentQualifications: z.string().max(1000, "Qualifications must be less than 1000 characters").optional(),
  perceivedNeeds: z.string().max(1000, "Needs must be less than 1000 characters").optional(),
});

export const foodFieldsSchema = z.object({
  veteranBranch: z.string().min(1, "Please select your branch of service"),
  veteranStatus: z.string().min(1, "Please select your veteran status"),
  householdSize: z.string().optional(),
  dietaryRestrictions: z.string().max(500, "Dietary restrictions must be less than 500 characters").optional(),
  foodNeeds: z.string().max(1000, "Food needs must be less than 1000 characters").optional(),
  preferredPickupLocation: z.string().optional(),
});

// Volunteer application schema
export const volunteerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  availability: z
    .array(z.string())
    .min(1, "Please select at least one day of availability"),
  experience: z.string().max(2000, "Experience must be less than 2000 characters").optional(),
  message: z.string().max(1000, "Message must be less than 1000 characters").optional(),
});

// Donation schema
export const donationSchema = z.object({
  name: z.string().trim().max(100, "Name must be less than 100 characters").optional(),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  amount: z.string().min(1, "Please select or enter an amount"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
});

// Mailing list / community subscription schema
export const mailingListSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Please enter a valid phone number (10-20 digits)"),
  wantsNotifications: z.boolean(),
  contactPreference: z.enum(["email", "text", "both"], {
    required_error: "Please select a contact preference",
  }),
});

// Validation helper function
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join(".");
    if (!errors[path]) {
      errors[path] = err.message;
    }
  });
  
  return { success: false, errors };
}

export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type VolunteerInfo = z.infer<typeof volunteerSchema>;
export type DonationInfo = z.infer<typeof donationSchema>;
export type MailingListInfo = z.infer<typeof mailingListSchema>;
