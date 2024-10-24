import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallComposite,
  CallCompositeOptions,
  CallingSounds,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { PartialTheme, Stack, Theme } from '@fluentui/react';
import React, { useMemo } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  groupId: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  options?: CallCompositeOptions;
};

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const { userId, token, formFactor, fluentTheme, options, groupId } = props;
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(token);
    } catch {
      console.error('failed to construct token credential');
      return undefined;
    }
  }, [token]);

  const callAdapterArgs = useMemo(() => {
    /**
     * These are the different sound events that happen in the calling experiences that we provide.
     * You will need to provide paths to where your sounds will live and make sure that they are loaded appropriately.
     */
    const callingSounds: CallingSounds = {
      callRinging: { url: 'path/to/your/ring/tone.mp3' },
      callEnded: { url: 'path/to/your/end/call/tone.mp3' },
      callBusy: { url: 'path/to/your/busy/tone.mp3' }
    };
    return {
      userId,
      credential,
      locator: { groupId },
      options: {
        callingSounds: callingSounds
      }
    };
  }, [credential, groupId, userId]);

  const adapter = useAzureCommunicationCallAdapter(callAdapterArgs);

  if (adapter) {
    return (
      <Stack>
        <CallComposite adapter={adapter} formFactor={formFactor} fluentTheme={fluentTheme} options={options} />
      </Stack>
    );
  }

  return <></>;
};
