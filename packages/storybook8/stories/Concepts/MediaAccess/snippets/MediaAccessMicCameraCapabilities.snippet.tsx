import { CapabilitiesChangeInfo } from '@azure/communication-calling';
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
  meetingLink?: string;
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
        ? {
            meetingLink: props.meetingLink
          }
        : undefined
    }),
    [props.userId, credential, props.meetingLink]
  );

  /**
   * Logging local participants' Media access state with capabilitiesChanged event
   * unmuteMic: true if the user can unmute the microphone, false otherwise
   * turnVideoOn: true if the user can turn on the video, false otherwise
   */
  const afterCallAdapterCreate = useCallback(async (adapter: CallAdapter): Promise<CallAdapter> => {
    adapter.on('capabilitiesChanged', (capabilitiesChangeInfo: CapabilitiesChangeInfo) => {
      if (capabilitiesChangeInfo.newValue.unmuteMic !== undefined) {
        console.log('unmuteMic capabilities changed info: ', capabilitiesChangeInfo);
      }
      if (capabilitiesChangeInfo.newValue.turnVideoOn !== undefined) {
        console.log('turnVideoOn capabilities changed info: ', capabilitiesChangeInfo);
      }
    });
    return adapter;
  }, []);

  const adapter = useAzureCommunicationCallAdapter(callAdapterArgs, afterCallAdapterCreate);

  if (!props.meetingLink) {
    return <>Teams meeting link is not provided.</>;
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
