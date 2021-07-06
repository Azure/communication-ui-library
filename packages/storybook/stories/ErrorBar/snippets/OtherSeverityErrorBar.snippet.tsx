import { ErrorBar } from '@internal/react-composites';
import React from 'react';

export const OtherSeverityErrorBarExample: () => JSX.Element = () => {
  return (
    <>
      <ErrorBar message="This is a info message" severity={'info'} />
      <ErrorBar message="This is a warning message" severity={'warning'} />
      <ErrorBar message="This message will not be shown" severity={'error'} />
    </>
  );
};
