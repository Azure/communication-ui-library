import { GroupCallLocator, RoomCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallAdapterLocator,
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useMemo } from 'react';
import { validate as validateUUID } from 'uuid';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  locator?: CallAdapterLocator;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
};

const isTeamsMeetingLink = (link: string): boolean => link.startsWith('https://teams.microsoft.com/l/meetup-join');
const isGroupID = (id: string): boolean => validateUUID(id);
const isRoomID = (id: string): boolean => {
  const num = Number(id);

  if (Number.isInteger(num) && num > 0) {
    return true;
  }

  return false;
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

  if (!props.locator) {
    return <>Call locator is not provided.</>;
  } else if ('meetingLink' in props.locator) {
    const teamsLocator = props.locator as TeamsMeetingLinkLocator;
    if (typeof teamsLocator.meetingLink !== 'string') {
      return <>Teams meeting link should be a string.</>;
    }
    if (teamsLocator.meetingLink && !isTeamsMeetingLink(teamsLocator.meetingLink)) {
      return <>Teams meeting link '{teamsLocator.meetingLink}' is not recognized.</>;
    }
  } else if ('groupId' in props.locator) {
    const groupLocator = props.locator as GroupCallLocator;
    if (typeof groupLocator.groupId !== 'string') {
      return <>Group id should be a string.</>;
    }
    if (!groupLocator.groupId && !isGroupID(groupLocator.groupId)) {
      return <>Group id '{groupLocator.groupId}' is not recognized.</>;
    }
  } else if ('roomId' in props.locator) {
    const roomLocator = props.locator as RoomCallLocator;
    if (typeof roomLocator.roomId !== 'string') {
      return <>Room id should be a string.</>;
    }
    if (!isRoomID(roomLocator.roomId)) {
      return <>Room id '{roomLocator.roomId}' is not recognized.</>;
    }
  } else {
    return <>Call locator '{props.locator}' is not recognized.</>;
  }

  const adapter = useAzureCommunicationCallAdapter(
    {
      userId: props.userId,
      displayName: props.displayName, // Max 256 Characters
      credential,
      locator: props.locator
    },
    undefined,
    leaveCall
  );

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <CallComposite
          adapter={adapter}
          formFactor={props.formFactor}
          fluentTheme={props.fluentTheme}
          callInvitationUrl={props?.callInvitationURL}
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

const leaveCall = async (adapter: CallAdapter): Promise<void> => {
  await adapter.leaveCall().catch((e) => {
    console.error('Failed to leave call', e);
  });
};
