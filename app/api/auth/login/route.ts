import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validation'

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
    const validationResult = loginSchema.safeParse(body)
    
    if (!validationResult.success) {
      return Response.json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      }, { status: 400 })
    }

    const { email, password } = validationResult.data

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase() 
      },
      include: {
        studentProfile: true,
        companyProfile: true,
      }
    })

    if (!user) {
      return Response.json({
        success: false,
        message: 'Invalid email or password',
      }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash)
    
    if (!isValidPassword) {
      return Response.json({
        success: false,
        message: 'Invalid email or password',
      }, { status: 401 })
    }

    // Check if user account is active (if you have account status)
    // if (!user.isActive) {
    //   return Response.json({
    //     success: false,
    //     message: 'Account is disabled. Please contact support.',
    //   }, { status: 403 })
    // }

    // Update last login timestamp (optional)
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { 
    //     lastLoginAt: new Date() 
    //   }
    // })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
    })

    // Determine which profile to return
    const profile = user.userType === 'STUDENT' ? user.studentProfile : user.companyProfile

    // Return success response (don't send password hash)
    return Response.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        profile,
        token,
      },
    }, { status: 200 })
    
  } catch (error) {
    console.error('Login error:', error)

    return Response.json({
      success: false,
      message: 'Internal server error. Please try again later.',
    }, { status: 500 })
  }
}