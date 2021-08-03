import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  ChatAdapter,
  MeetingComposite,
  createAzureCommunicationCallAdapter,
  createAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { Theme, PartialTheme } from '@fluentui/react';
import React, { useState, useEffect, useMemo } from 'react';

export type MeetingExampleProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  locator: GroupCallLocator | TeamsMeetingLinkLocator;
  threadId: string;
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
};

export const MeetingExperience = (props: MeetingExampleProps): JSX.Element => {
  const [callAdapter, setCallAdapter] = useState<CallAdapter>();
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter>();

  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  useEffect(() => {
    if (
      props &&
      credential &&
      props.locator &&
      props.displayName &&
      props.threadId &&
      props.userId &&
      props.endpointUrl
    ) {
      const createAdapters = async (): Promise<void> => {
        setCallAdapter(
          await createAzureCommunicationCallAdapter({
            userId: { kind: 'communicationUser', communicationUserId: props.userId.communicationUserId },
            displayName: props.displayName,
            credential,
            locator: props.locator
          })
        );

        setChatAdapter(
          await createAzureCommunicationChatAdapter(
            props.endpointUrl,
            { kind: 'communicationUser', communicationUserId: props.userId.communicationUserId },
            props.displayName,
            credential,
            props.threadId
          )
        );
      };
      createAdapters();
    }
  }, [credential, props]);

  if (callAdapter && chatAdapter) {
    return <MeetingComposite callAdapter={callAdapter} chatAdapter={chatAdapter} fluentTheme={props.fluentTheme} />;
  }

  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  return <>Initializing...</>;
};
