import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  MeetingCallControlOptions,
  MeetingAdapter,
  MeetingComposite,
  createAzureCommunicationMeetingAdapter,
  CustomCallControlButtonCallback,
  CustomCallControlButtonCallbackArgs,
  CustomCallControlButtonProps
} from '@azure/communication-react';
import { Theme, PartialTheme, Icon } from '@fluentui/react';
import React, { useState, useEffect, useMemo } from 'react';

export type MeetingCustomButtonExampleProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  locator: GroupCallLocator | TeamsMeetingLinkLocator;
  threadId: string;
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  displayCustomButton?: boolean;
  meetingCallControlOptions?: boolean | MeetingCallControlOptions;
};

export const MeetingCustomButtonExperience = (props: MeetingCustomButtonExampleProps): JSX.Element => {
  const [meetingAdapter, setMeetingAdapter] = useState<MeetingAdapter>();

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
        setMeetingAdapter(
          await createAzureCommunicationMeetingAdapter({
            userId: props.userId,
            displayName: props.displayName,
            credential,
            callLocator: props.locator,
            endpoint: props.endpointUrl,
            chatThreadId: props.threadId
          })
        );
      };
      createAdapters();
    }
  }, [props, credential]);

  if (meetingAdapter) {
    return (
      <MeetingComposite
        meetingAdapter={meetingAdapter}
        fluentTheme={props.fluentTheme}
        options={props?.displayCustomButton ? { callControls: { onFetchCustomButtonProps } } : undefined}
      />
    );
  }

  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  return <>Initializing...</>;
};

const onFetchCustomButtonProps: CustomCallControlButtonCallback[] = [
  (args: CustomCallControlButtonCallbackArgs): CustomCallControlButtonProps => {
    return {
      showLabel: args.displayType !== 'compact',
      // Some non-default icon that is already registered by the composites.
      onRenderOffIcon: () => <Icon iconName="MessageSeen" />,
      onRenderOnIcon: () => <Icon iconName="MessageSeen" />,
      strings: {
        label: 'custom #1'
      },
      placement: 'beforeMicrophoneButton'
    };
  },
  (args: CustomCallControlButtonCallbackArgs): CustomCallControlButtonProps => {
    return {
      showLabel: args.displayType !== 'compact',
      // Some non-default icon that is already registered by the composites.
      onRenderOffIcon: () => <Icon iconName="EditBoxCancel" />,
      onRenderOnIcon: () => <Icon iconName="EditBoxCancel" />,
      strings: {
        label: 'custom #2'
      },
      placement: 'beforeChatButton'
    };
  }
];
