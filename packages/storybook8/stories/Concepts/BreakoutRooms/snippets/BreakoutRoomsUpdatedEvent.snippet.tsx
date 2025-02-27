import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useCallback, useMemo } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
  // Teams user ids need to be in format '28:orgid:<UUID>'. For example, '28:orgid:87d349ed-44d7-43e1-9a83-5f2406dee5bd'
  meetingLink: string;
};

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  const callAdapterArgs = useMemo(
    () => ({
      userId: props.userId,
      credential,
      locator: props.meetingLink
    }),
    [props.userId, credential, props.meetingLink]
  );

  const afterCallAdapterCreate = useCallback(async (adapter: CallAdapter): Promise<CallAdapter> => {
    adapter.on('breakoutRoomsUpdated', (event) => {
      if (event.type === 'assignedBreakoutRooms') {
        console.log('Assigned breakout rooms event: ', event);
      } else if (event.type === 'join') {
        console.log('Breakout rooms join event: ', event);
      } else if (event.type === 'breakoutRoomsSettings') {
        console.log('Breakout rooms settings event: ', event);
      }
    });
    return adapter;
  }, []);

  const leaveCall = async (adapter: CallAdapter): Promise<void> => {
    await adapter.leaveCall().catch((e) => {
      console.error('Failed to leave call', e);
    });
  };

  const adapter = useAzureCommunicationCallAdapter(callAdapterArgs, afterCallAdapterCreate, leaveCall);

  if (!props.meetingLink) {
    return <>Teams meeting link not provided.</>;
  }

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <CallComposite
          adapter={adapter}
          formFactor={props.formFactor}
          fluentTheme={props.fluentTheme}
          locale={props?.locale}
          options={props?.options}
        />
      </div>
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
};
