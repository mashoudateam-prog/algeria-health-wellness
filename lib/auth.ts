import { prisma } from './db'
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: 'PATIENT' | 'PROFESSIONAL' | 'FACILITY_ADMIN' | 'PLATFORM_ADMIN' = 'PATIENT'
) {
  const hashedPassword = await hashPassword(password)

  return prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
    },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      patientProfile: true,
      professionalProfile: true,
    },
  })
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      patientProfile: true,
      professionalProfile: true,
    },
  })
}
