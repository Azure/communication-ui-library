import React, { useState, useEffect } from 'react';
import { CallComposite, CallAdapter, createAzureCommunicationCallAdapter } from 'react-composites';
import { Prerequisites } from './Server.snippet';

export const ContosoCallContainer = (props: { prerequisites: Prerequisites }): JSX.Element => {
  const { prerequisites } = props;

  const [adapter, setAdapter] = useState<CallAdapter>();

  useEffect(() => {
    if (prerequisites.token && prerequisites.userId && prerequisites.groupId) {
      const createAdapter = async (): Promise<void> => {
        setAdapter(
          await createAzureCommunicationCallAdapter(
            prerequisites.token,
            prerequisites.groupId,
            prerequisites.displayName
          )
        );
      };
      createAdapter();
    }
  }, [prerequisites]);

  return <>{adapter && <CallComposite adapter={adapter} />}</>;
};
