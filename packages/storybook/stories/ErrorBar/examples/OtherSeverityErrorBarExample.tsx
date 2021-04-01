import React from 'react';
import { ErrorBar, CommunicationUiErrorSeverity } from '../../../../communication-ui/src';

export const OtherSeverityErrorBarExample: () => JSX.Element = () => {
  return (
    <>
      <ErrorBar message="This is a info message" severity={CommunicationUiErrorSeverity.INFO} />
      <ErrorBar message="This is a warning message" severity={CommunicationUiErrorSeverity.WARNING} />
    </>
  );
};
