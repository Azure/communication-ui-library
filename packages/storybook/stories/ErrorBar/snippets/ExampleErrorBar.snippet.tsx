import { ErrorBar } from '@azure/communication-react';
import React from 'react';

export const ExampleErrorBar = (): JSX.Element => {
  return (
    <ErrorBar
      activeErrorMessages={[
        {
          type: 'callCameraAccessDenied',
          timestamp: new Date()
        }
      ]}
    />
  );
};
