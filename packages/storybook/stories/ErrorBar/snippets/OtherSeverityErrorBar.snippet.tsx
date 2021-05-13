import { ErrorBar } from '@azure/communication-react';
import React from 'react';

export const OtherSeverityErrorBarExample: () => JSX.Element = () => {
  return (
    <>
      <ErrorBar message="This is a info message" severity={'Info'} />
      <ErrorBar message="This is a warning message" severity={'Warning'} />
      <ErrorBar message="This message will not be shown" severity={'Error'} />
    </>
  );
};
