import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserType } from '@prisma/client'

// Types
export interface JWTPayload {
  userId: string
  email: string
  userType: UserType
}

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

// JWT token management
export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }
  
  return jwt.sign(payload, secret, {
    expiresIn: '7d', // Token expires in 7 days
  })
}

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not defined')
    }
    
    const payload = jwt.verify(token, secret) as JWTPayload
    return payload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Extract token from Authorization header
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  return authHeader.substring(7) // Remove 'Bearer ' prefix
}