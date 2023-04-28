import prisma from '@/app/libs/prismadb';
import { any } from 'prop-types';

interface IParams {
  listingId?: string;
  userId?: string;
  author?: string;
}

export default async function getReservations(params: IParams) {
  try {
    const { author, userId, listingId } = params;

    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (author) {
      query.listing = { userId: author };
    }

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const safeReservation = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
      },
    }));

    return safeReservation;
  } catch (e: any) {
    throw new Error(e);
  }
}
