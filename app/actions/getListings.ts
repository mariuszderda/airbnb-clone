import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '@/app/libs/prismadb'

export async function getSession() {
  return await getServerSession(authOptions)
}

export default async function getListings() {
  try {

    const listings = await prisma.listing.findMany({
      orderBy:{
        createdAt: 'desc'
      }
    })

    return listings

  } catch (e: any) {
    throw new Error(e)
  }
}
