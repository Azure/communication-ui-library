import { CommunicationUserIdentifier, AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  ChatAdapter,
  ChatComposite,
  fromFlatCommunicationIdentifier,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo } from 'react';

interface ChatScreenPropsExample {
  // the ACS communication token that would be used to fetch inline images
  token: string;
  userId: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
}

export const InlineImageCompositeExample = (props: ChatScreenPropsExample): JSX.Element => {
  const { displayName, endpointUrl, threadId, token, userId } = props;

  const adapterAfterCreate = useCallback(async (adapter: ChatAdapter): Promise<ChatAdapter> => {
    adapter.on('error', (e) => {
      console.error(e);
    });
    return adapter;
  }, []);

  const adapterArgs = useMemo(
    () => ({
      endpoint: endpointUrl,
      userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
      displayName,
      // the credential is used to fetch preview images
      credential: new AzureCommunicationTokenCredential(token),
      threadId
    }),

    [endpointUrl, userId, displayName, token, threadId]
  );

  const adapter = useAzureCommunicationChatAdapter(adapterArgs, adapterAfterCreate);

  // Dispose of the adapter in the window's before unload event
  useEffect(() => {
    const disposeAdapter = (): void => adapter?.dispose();
    window.addEventListener('beforeunload', disposeAdapter);
    return () => window.removeEventListener('beforeunload', disposeAdapter);
  }, [adapter]);

  if (adapter) {
    return (
      <Stack>
        <Stack.Item>
          <ChatComposite
            adapter={adapter}
            options={{
              autoFocus: 'sendBoxTextField'
            }}
          />
        </Stack.Item>
      </Stack>
    );
  }
  return <>Initializing...</>;
};
