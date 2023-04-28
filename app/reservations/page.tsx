import getCurrentUser from '@/app/actions/getCurrentUser'
import ClientOnly from '@/app/components/ClientOnly'
import EmptyState from '@/app/components/EmptyState'
import getReservations from '@/app/actions/getReservations'
import ReservationClient from '@/app/reservations/ReservationClient'

const ReservationPage = async () => {

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login." />
      </ClientOnly>
    );
  }

  const reservations = await getReservations({
    authorId: currentUser.id,
  });

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="Reservation not found."
          subtitle="Looks like there are no reservations for your properties."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ReservationClient
        currentUser={currentUser}
        reservations={reservations}
      />
    </ClientOnly>
  );
};

export default ReservationPage;
