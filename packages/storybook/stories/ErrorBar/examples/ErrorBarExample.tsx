import React from 'react';
import { ErrorBar, CommunicationUiErrorSeverity } from '@azure/communication-ui';

export const ErrorBarExample: () => JSX.Element = () => {
  const message = 'Something went wrong';
  const severity = CommunicationUiErrorSeverity.ERROR;
  const onClearError = (): void => alert('closed error bar');
  return <ErrorBar message={message} severity={severity} onClose={onClearError} />;
};
