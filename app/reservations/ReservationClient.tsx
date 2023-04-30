'use client';

import { SafeReservation, SafeUser } from '@/app/types';
import Container from '@/app/components/Container';
import Heading from '@/app/components/Heading';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ListingCard from '@/app/components/listings/ListingCard';

interface ReservationClientProps {
  currentUser?: SafeUser | null;
  reservations: SafeReservation[];
}

const ReservationClient: React.FC<ReservationClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success('Reservation cancelled.');
          router.refresh();
        })
        .catch((e) => {
          toast.error('Something went wrong.');
        })
        .finally(() => {
          setDeletingId('');
        });
    },
    [router]
  );

  return (
    <Container>
      <Heading title="Reservations" subtitle="Bookings on your properties" />
      <div
        className="mt-10
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              2xl:grid-cols-6
              gap-8"
      >
        {reservations.map((reservation) => (
          <ListingCard
            data={reservation.listing}
            currentUser={currentUser}
            key={reservation.id}
            reservation={reservation}
            actionId={reservation.id}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel reservation"
            onAction={onCancel}
          />
        ))}
      </div>
    </Container>
  );
};

export default ReservationClient;
