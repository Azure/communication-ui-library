import React from 'react';
import { ErrorBar, CommunicationUiErrorSeverity } from '@azure/communication-ui';

export const OtherSeverityErrorBarExample: () => JSX.Element = () => {
  return (
    <>
      <ErrorBar message="This is a info message" severity={CommunicationUiErrorSeverity.INFO} />
      <ErrorBar message="This is a warning message" severity={CommunicationUiErrorSeverity.WARNING} />
      <ErrorBar message="This message will not be shown" severity={CommunicationUiErrorSeverity.IGNORE} />
    </>
  );
};
