'use client';

import { FC, useEffect } from 'react';
import EmptyState from '@/app/components/EmptyState';

interface ErrorStateProps {
  error: Error;
}

const ErrorState: FC<ErrorStateProps> = ({ error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <EmptyState title="Uh no..." subtitle="Something went wrong" />;
};

export default ErrorState;
