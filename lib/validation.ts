import { z } from 'zod'
import { UserType, CompanySize } from '@prisma/client'

// Base user registration schema
export const baseUserRegistrationSchema = z.object({
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  userType: z.enum(UserType),
})

// Student registration schema
export const studentRegistrationSchema = baseUserRegistrationSchema.extend({
  userType: z.literal(UserType.STUDENT),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  university: z.string().min(1, 'University is required').max(100, 'University name too long'),
  major: z.string().min(1, 'Major is required').max(100, 'Major name too long'),
  graduationYear: z
    .number()
    .int()
    .min(2024, 'Graduation year must be 2024 or later')
    .max(2030, 'Graduation year must be 2030 or earlier'),
  phone: z.string().optional(),
})

// Company registration schema
export const companyRegistrationSchema = baseUserRegistrationSchema.extend({
  userType: z.literal(UserType.COMPANY),
  companyName: z.string().min(1, 'Company name is required').max(100, 'Company name too long'),
  industry: z.string().min(1, 'Industry is required').max(50, 'Industry name too long'),
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  companySize: z.enum(CompanySize),
  website: z.url('Invalid website URL').optional().or(z.literal('')),
  description: z.string().max(1000, 'Description too long').optional(),
})

export const internshipSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  requirements: z.union([
    z.array(z.string()),
    z.string()
  ]),
  duration: z.string().min(1, 'Duration is required'),
  stipend: z.number().optional(),
  applicationDeadline: z.iso.datetime().optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
})

export type InternshipData = z.infer<typeof internshipSchema>


// Union type for registration
export const registrationSchema = z.discriminatedUnion('userType', [
  studentRegistrationSchema,
  companyRegistrationSchema,
])

// Login schema
export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Type exports for use in components
export type StudentRegistrationData = z.infer<typeof studentRegistrationSchema>
export type CompanyRegistrationData = z.infer<typeof companyRegistrationSchema>
export type RegistrationData = z.infer<typeof registrationSchema>
export type LoginData = z.infer<typeof loginSchema>