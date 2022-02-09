import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAndChatLocator,
  CallAndChatControlOptions,
  CallAndChatAdapter,
  CallAndChatComposite,
  createAzureCommunicationCallAndChatAdapter
} from '@azure/communication-react';
import { Theme, PartialTheme } from '@fluentui/react';
import React, { useState, useEffect, useMemo } from 'react';

export type CallAndChatExampleProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  callAndChatLocator: TeamsMeetingLinkLocator | CallAndChatLocator;
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  callAndChatControlOptions?: boolean | CallAndChatControlOptions;
};

export const CallAndChatExperience = (props: CallAndChatExampleProps): JSX.Element => {
  const [callAndChatAdapter, setCallAndChatAdapter] = useState<CallAndChatAdapter>();

  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  useEffect(() => {
    if (props && credential && props.callAndChatLocator && props.displayName && props.userId && props.endpointUrl) {
      const createAdapters = async (): Promise<void> => {
        setCallAndChatAdapter(
          await createAzureCommunicationCallAndChatAdapter({
            userId: props.userId,
            displayName: props.displayName,
            credential,
            callAndChatLocators: props.callAndChatLocator,
            endpoint: props.endpointUrl
          })
        );
      };
      createAdapters();
    }
  }, [credential, props]);

  if (callAndChatAdapter) {
    const options = { callControls: props.callAndChatControlOptions };
    return (
      <CallAndChatComposite callAndChatAdapter={callAndChatAdapter} fluentTheme={props.fluentTheme} options={options} />
    );
  }

  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  return <>Initializing...</>;
};
