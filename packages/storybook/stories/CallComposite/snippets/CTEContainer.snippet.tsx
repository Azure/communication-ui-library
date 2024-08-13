import { TeamsMeetingIdLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, MicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import {
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  TeamsCallAdapter,
  useTeamsCallAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useMemo } from 'react';

export type ContainerProps = {
  userId: MicrosoftTeamsUserIdentifier;
  token: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPasscode?: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  rtl?: boolean;
  callInvitationURL?: string;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
};

const isTeamsMeetingLink = (link: string): boolean =>
  link.startsWith('https://teams.microsoft.com/meet/') || link.startsWith('https://teams.microsoft.com/l/meetup-join');

const createCallAdapterLocator = (
  locator?: string,
  meetingId?: string,
  meetingPasscode?: string
): TeamsMeetingLinkLocator | TeamsMeetingIdLocator | undefined => {
  if (locator && isTeamsMeetingLink(locator)) {
    return { meetingLink: locator };
  }
  if (meetingId && meetingPasscode) {
    return { meetingId: meetingId, passcode: meetingPasscode };
  }
  return undefined;
};

export const ContosoCTECallContainer = (props: ContainerProps): JSX.Element => {
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  const locator = useMemo(
    () => createCallAdapterLocator(props.meetingLink, props.meetingId, props.meetingPasscode),
    [props.meetingLink, props.meetingId, props.meetingPasscode]
  );

  const adapter = useTeamsCallAdapter(
    {
      userId: props.userId,
      credential,
      locator
    },
    undefined,
    leaveCall
  );

  if (!locator) {
    return <>Provided call locator '{props.meetingLink ? props.meetingLink : props.meetingId}' is not recognized.</>;
  }

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <CallComposite
          adapter={adapter}
          formFactor={props.formFactor}
          fluentTheme={props.fluentTheme}
          rtl={props.rtl}
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

const leaveCall = async (adapter: TeamsCallAdapter): Promise<void> => {
  await adapter.leaveCall().catch((e) => {
    console.error('Failed to leave call', e);
  });
};
