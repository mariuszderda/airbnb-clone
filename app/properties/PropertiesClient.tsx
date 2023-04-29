'use client';

import { SafeListing, SafeReservation, SafeUser } from '@/app/types';
import Container from '@/app/components/Container';
import Heading from '@/app/components/Heading';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ListingCard from '@/app/components/listings/ListingCard';

interface PropertiesClientProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/listings/${id}`)
        .then(() => {
          toast.success('Listing deleted.');
          router.refresh();
        })
        .catch((e) => {
          toast.error(e?.response?.data?.error);
        })
        .finally(() => {
          setDeletingId('');
        });
    },
    [router]
  );

  return (
    <Container>
      <Heading
        title="Properties"
        subtitle="Where you've been and where you're going."
      />
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
        {listings.map((listing) => (
          <ListingCard
            data={listing}
            currentUser={currentUser}
            key={listing.id}
            actionId={listing.id}
            disabled={deletingId === listing.id}
            actionLabel="Delete property"
            onAction={onCancel}
          />
        ))}
      </div>
    </Container>
  );
};

export default PropertiesClient;
