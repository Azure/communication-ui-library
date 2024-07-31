import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { CallComposite, CallAdapterLocator, useAzureCommunicationCallAdapter } from '@azure/communication-react';
import React, { useMemo } from 'react';

type CallAdapterExampleProps = {
  userId: CommunicationUserIdentifier;
  accessToken: string;
  callLocator: CallAdapterLocator;
  displayName: string;
};

export const CallAdapterExample = (props: CallAdapterExampleProps): JSX.Element => {
  const credential = useMemo(() => new AzureCommunicationTokenCredential(props.accessToken), [props.accessToken]);
  const adapter = useAzureCommunicationCallAdapter({
    userId: props.userId,
    displayName: props.displayName,
    credential,
    locator: props.callLocator
  });
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {adapter ? <CallComposite adapter={adapter} /> : <>Initializing</>}
    </div>
  );
};
