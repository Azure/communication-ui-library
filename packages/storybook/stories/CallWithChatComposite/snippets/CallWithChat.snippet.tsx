import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAndChatLocator,
  CallWithChatControlOptions,
  CallWithChatComposite,
  useAzureCommunicationCallWithChatAdapter
} from '@azure/communication-react';
import { Theme, PartialTheme } from '@fluentui/react';
import React, { useMemo } from 'react';

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
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);
  const adapter = useAzureCommunicationCallWithChatAdapter({
    userId: props.userId,
    displayName: props.displayName,
    credential,
    locator: props.locator,
    endpoint: props.endpointUrl
  });

  if (adapter) {
    const options = { callControls: props.callWithChatControlOptions };
    return <CallWithChatComposite adapter={adapter} fluentTheme={props.fluentTheme} options={options} />;
  }

  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  return <>Initializing...</>;
};
