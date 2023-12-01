import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallAdapterLocator,
  CallComposite,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { Spinner, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';

export interface CallScreenProps {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  callLocator: CallAdapterLocator;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId, displayName, callLocator } = props;
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(token);
    } catch {
      console.error('failed to construct token credential');
      return undefined;
    }
  }, [token]);

  const callAdapterArgs = useMemo(() => {
    return {
      userId,
      credential,
      locator: callLocator,
      displayName
    };
  }, [credential, callLocator, userId, displayName]);

  const afterCreate = (adapter: CallAdapter): Promise<CallAdapter> => {
    /**
     * Subscribing to this event on the call adapter will allow you to see the different
     * errors that can occur in the calling experience. When these events happen using the callback you
     * can update your application to render the appropriate UI to recover from the error.
     *
     * If you do nothing on this event the CallComposite and adapter do catch the error internally
     * and will recover from it on its own.
     */
    adapter.on('error', (e: any) => {
      /**
       * Error handling code goes here
       */
      console.log('Adapter error event:', e);
    });

    return new Promise<CallAdapter>(() => adapter);
  };

  const adapter = useAzureCommunicationCallAdapter(callAdapterArgs, afterCreate);

  if (!adapter) {
    return (
      <Stack>
        <Spinner label={'Getting your credentials'}></Spinner>
      </Stack>
    );
  }

  return (
    <Stack>
      <CallComposite adapter={adapter} />
    </Stack>
  );
};
