import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { Theme, PartialTheme } from '@fluentui/react';
import {
  CallAdapter,
  ChatAdapter,
  MeetingComposite,
  createAzureCommunicationCallAdapter,
  createAzureCommunicationChatAdapter
} from '@internal/react-composites';
import React, { useState, useEffect } from 'react';

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
  // Creating an adapter is asynchronous.
  // An update to `config` triggers a new adapter creation, via the useEffect block.
  // When the adapter becomes ready, the state update triggers a re-render of the ChatComposite.
  const [callAdapter, setCallAdapter] = useState<CallAdapter>();
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    if (
      props &&
      props.token &&
      props.locator &&
      props.displayName &&
      props.threadId &&
      props.userId &&
      props.endpointUrl
    ) {
      const createAdapters = async (): Promise<void> => {
        setCallAdapter(
          await createAzureCommunicationCallAdapter(props.userId, props.token, props.locator, props.displayName)
        );

        setChatAdapter(
          await createAzureCommunicationChatAdapter(
            props.userId,
            props.token,
            props.endpointUrl,
            props.threadId,
            props.displayName
          )
        );
      };
      createAdapters();
    }
  }, [props]);

  return (
    <>
      {callAdapter && chatAdapter ? (
        <MeetingComposite callAdapter={callAdapter} chatAdapter={chatAdapter} fluentTheme={props.fluentTheme} />
      ) : (
        <h3>Loading...</h3>
      )}
    </>
  );
};
