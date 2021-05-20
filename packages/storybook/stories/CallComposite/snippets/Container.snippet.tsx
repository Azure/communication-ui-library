import React, { useState, useEffect } from 'react';
import { CallComposite, CallAdapter, createAzureCommunicationCallAdapter } from 'react-composites';

export type ContainerProps = {
  endpointUrl: string;
  token: string;
  groupId: string;
  displayName: string;
};

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const [adapter, setAdapter] = useState<CallAdapter>();

  useEffect(() => {
    if (props.token && props.groupId) {
      const createAdapter = async (): Promise<void> => {
        setAdapter(await createAzureCommunicationCallAdapter(props.token, props.groupId, props.displayName));
      };
      createAdapter();
    }
  }, [props]);

  return <>{adapter && <CallComposite adapter={adapter} />}</>;
};
