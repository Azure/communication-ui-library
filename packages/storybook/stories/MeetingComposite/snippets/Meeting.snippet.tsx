import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAndChatLocator,
  CallWithChatControlOptions,
  CallWithChatAdapter,
  CallWithChatComposite,
  createAzureCommunicationCallWithChatAdapter
} from '@azure/communication-react';
import { Theme, PartialTheme } from '@fluentui/react';
import React, { useState, useEffect, useMemo } from 'react';

export type CallWithChatExampleProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  locator: TeamsMeetingLinkLocator | CallAndChatLocator;
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  callWithChatControlOptions?: boolean | CallWithChatControlOptions;
};

export const CallWithChatExperience = (props: CallWithChatExampleProps): JSX.Element => {
  const [callWithChatAdapter, setCallWithChatAdapter] = useState<CallWithChatAdapter>();

  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  useEffect(() => {
    if (props && credential && props.locator && props.displayName && props.userId && props.endpointUrl) {
      const createAdapters = async (): Promise<void> => {
        setCallWithChatAdapter(
          await createAzureCommunicationCallWithChatAdapter({
            userId: props.userId,
            displayName: props.displayName,
            credential,
            locator: props.locator,
            endpoint: props.endpointUrl
          })
        );
      };
      createAdapters();
    }
  }, [credential, props]);

  if (callWithChatAdapter) {
    const options = { callControls: props.callWithChatControlOptions };
    return (
      <CallWithChatComposite
        callWithChatAdapter={callWithChatAdapter}
        fluentTheme={props.fluentTheme}
        options={options}
      />
    );
  }

  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  return <>Initializing...</>;
};
