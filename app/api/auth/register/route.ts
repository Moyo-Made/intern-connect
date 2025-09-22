import { NextRequest } from 'next/server'
import { UserType } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { registrationSchema } from '@/lib/validation'

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    
    // Validate request data
    const validationResult = registrationSchema.safeParse(body)
    
    if (!validationResult.success) {
      return Response.json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      }, { status: 400 })
    }

    const data = validationResult.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    })

    if (existingUser) {
      return Response.json({
        success: false,
        message: 'An account with this email already exists',
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user and profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create base user
      const user = await tx.user.create({
        data: {
          email: data.email.toLowerCase(),
          passwordHash: hashedPassword,
          userType: data.userType,
        }
      })

      // Create profile based on user type
      if (data.userType === UserType.STUDENT) {
        const studentData = data as typeof data & {
          firstName: string
          lastName: string
          university: string
          major: string
          graduationYear: number
          phone?: string
        }

        const studentProfile = await tx.studentProfile.create({
          data: {
            userId: user.id,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            university: studentData.university,
            major: studentData.major,
            graduationYear: studentData.graduationYear,
            phone: studentData.phone || null,
          }
        })

        return { user, profile: studentProfile }
      } else {
        const companyData = data as typeof data & {
          companyName: string
          industry: string
          location: string
          companySize: any
          website?: string
          description?: string
        }

        const companyProfile = await tx.companyProfile.create({
          data: {
            userId: user.id,
            companyName: companyData.companyName,
            industry: companyData.industry,
            location: companyData.location,
            companySize: companyData.companySize,
            website: companyData.website || null,
            description: companyData.description || null,
          }
        })

        return { user, profile: companyProfile }
      }
    })

    // Generate JWT token
    const token = generateToken({
      userId: result.user.id,
      email: result.user.email,
      userType: result.user.userType,
    })

    // Return success response (don't send password hash)
    return Response.json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          userType: result.user.userType,
          isVerified: result.user.isVerified,
          createdAt: result.user.createdAt,
        },
        profile: result.profile,
        token,
      },
    }, { status: 201 })
    
  } catch (error) {
    console.error('Registration error:', error)

    // Handle specific database errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return Response.json({
        success: false,
        message: 'An account with this email already exists',
      }, { status: 409 })
    }

    return Response.json({
      success: false,
      message: 'Internal server error. Please try again later.',
    }, { status: 500 })
  }
}