import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { ChatComposite, useAzureCommunicationChatAdapter } from '@azure/communication-react';
import React, { useMemo } from 'react';

type ChatAdapterExampleProps = {
  userId: CommunicationUserIdentifier;
  accessToken: string;
  endpointUrl: string;
  threadId: string;
  displayName: string;
};

export const ChatAdapterExample = (props: ChatAdapterExampleProps): JSX.Element => {
  const credential = useMemo(() => new AzureCommunicationTokenCredential(props.accessToken), [props.accessToken]);
  const adapter = useAzureCommunicationChatAdapter({
    endpoint: props.endpointUrl,
    userId: props.userId,
    displayName: props.displayName,
    credential,
    threadId: props.threadId
  });
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {adapter ? <ChatComposite adapter={adapter} /> : <>Initializing </>}
    </div>
  );
};
