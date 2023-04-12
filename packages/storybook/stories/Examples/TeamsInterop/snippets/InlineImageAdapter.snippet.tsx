import { AbortSignalLike } from '@azure/abort-controller';
import {
  CommunicationUserIdentifier,
  AzureCommunicationTokenCredential,
  CommunicationTokenRefreshOptions
} from '@azure/communication-common';

import {
  ChatAdapter,
  ChatComposite,
  fromFlatCommunicationIdentifier,
  toFlatCommunicationIdentifier,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';

import { Stack } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo } from 'react';

interface ChatScreenProps {
  token: string;
  userId: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  endChatHandler(isParticipantRemoved: boolean): void;
}

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { displayName, endpointUrl, threadId, token, userId, endChatHandler } = props;

  const adapterAfterCreate = useCallback(
    async (adapter: ChatAdapter): Promise<ChatAdapter> => {
      adapter.on('participantsRemoved', (listener) => {
        const removedParticipantIds = listener.participantsRemoved.map((p) => toFlatCommunicationIdentifier(p.id));
        if (removedParticipantIds.includes(userId)) {
          const removedBy = toFlatCommunicationIdentifier(listener.removedBy.id);
          endChatHandler(removedBy !== userId);
        }
      });
      adapter.on('error', (e) => {
        console.error(e);
      });
      return adapter;
    },
    [endChatHandler, userId]
  );

  const adapterArgs = useMemo(
    () => ({
      endpoint: endpointUrl,
      userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
      displayName,
      // the credential is used to fetch preview images
      credential: createAutoRefreshingCredential(userId, token),
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

const postRefreshTokenParameters = {
  method: 'POST'
};

/**
 * Create credentials that auto-refresh asynchronously.
 */
export const createAutoRefreshingCredential = (userId: string, token: string): AzureCommunicationTokenCredential => {
  const options: CommunicationTokenRefreshOptions = {
    token: token,
    tokenRefresher: refreshTokenAsync(userId),
    refreshProactively: true
  };

  return new AzureCommunicationTokenCredential(options);
};

const refreshTokenAsync = (userIdentity: string): ((abortSignal?: AbortSignalLike) => Promise<string>) => {
  return async (): Promise<string> => {
    const response = await fetch(`/refreshToken/${userIdentity}`, postRefreshTokenParameters);
    if (response.ok) {
      return (await response.json()).token;
    } else {
      throw new Error('could not refresh token');
    }
  };
};
