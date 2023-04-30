'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Range } from 'react-date-range';

import Modal from '@/app/components/modals/Modal';

import useSearchModal from '@/app/hooks/useSearchModal';
import dynamic from 'next/dynamic';
import CountrySelect, {
  CountrySelectValue,
} from '@/app/components/inputs/CountrySelect';
import qs from 'query-string';
import { formatISO } from 'date-fns';
import Heading from '@/app/components/Heading';
import Calendar from '@/app/components/inputs/Calendar';
import Counter from '@/app/components/inputs/Counter';

enum STEPS {
  LOCATION,
  DATE,
  INFO,
}

const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  const [location, setLocation] = useState<CountrySelectValue>();
  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const Map = useMemo(
    () => dynamic(() => import('../Map'), { ssr: false }),
    [location]
  );

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery;

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      roomCount,
      guestCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: '/',
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, [
    step,
    onNext,
    params,
    location,
    roomCount,
    guestCount,
    bathroomCount,
    dateRange,
    searchModal,
    setStep,
    router,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search';
    }

    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where do you want go?"
        subtitle="Find the perfect location."
      />
      <CountrySelect
        onChange={(value) => {
          setLocation(value as CountrySelectValue);
        }}
        value={location}
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do play to go?"
          subtitle="Make sure everyone is free"
        />
        <Calendar
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="More information" subtitle="Find your perfect place." />
        <Counter
          title="Guests"
          subtitle="How many guests are coming?"
          value={guestCount}
          onChange={(value) => setGuestCount(value)}
        />
        <Counter
          title="Rooms"
          subtitle="How many rooms do you need?"
          value={roomCount}
          onChange={(value) => setRoomCount(value)}
        />
        <Counter
          title="Bathroom"
          subtitle="How meny bathrooms do you need?"
          value={bathroomCount}
          onChange={(value) => setBathroomCount(value)}
        />
      </div>
    );
  }
  return (
    <div>
      <Modal
        onClose={searchModal.onClose}
        onSubmit={onSubmit}
        isOpen={searchModal.isOpen}
        title="Filters"
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
        body={bodyContent}
      />
    </div>
  );
};

export default SearchModal;
