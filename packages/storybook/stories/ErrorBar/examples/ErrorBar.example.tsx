import React from 'react';
import { ErrorBar } from '@azure/communication-ui';

export const ErrorBarExample: () => JSX.Element = () => {
  const message = 'Something went wrong';
  const onClearError = (): void => alert('closed error bar');
  return <ErrorBar message={message} onClose={onClearError} />;
};
