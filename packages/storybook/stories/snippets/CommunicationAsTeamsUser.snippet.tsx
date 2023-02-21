import { AzureCommunicationTokenCredential, MicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import {
  CallComposite,
  CallCompositeOptions,
  CompositeLocale,
  TeamsCallAdapter,
  useTeamsCallAdapter,
  Profile
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useMemo } from 'react';

export type ContainerProps = {
  userId: MicrosoftTeamsUserIdentifier;
  token: string;
  locator: string;
  displayName: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  locale?: CompositeLocale;
  options?: CallCompositeOptions;
  meetingUrl?: string;
};

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token); // <-- This props.token would be your Teams access token
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  // For multiple Azure Communication apps joining using teams identity,
  // you will need to provide displayName for other participants joining using Teams Identity,
  // otherwise "Unnamed Participant" would be shown as their default names.
  const onFetchProfile = async (userId: string, defaultProfile?: Profile): Promise<Profile> => {
    if (defaultProfile?.displayName) {
      return defaultProfile;
    }
    // You can fetch the display name from GraphAPI or your backend service using userId
    return { displayName: 'Unnamed Teams User' };
  };

  const adapter = useTeamsCallAdapter(
    {
      userId: props.userId,
      credential,
      locator: props.meetingUrl
        ? {
            meetingLink: props.meetingUrl
          }
        : undefined,
      options: {
        onFetchProfile
      }
    },
    undefined,
    leaveCall
  );

  if (!props.meetingUrl) {
    return <>Teams meeting link is not provided.</>;
  }

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

const leaveCall = async (adapter: TeamsCallAdapter): Promise<void> => {
  await adapter.leaveCall().catch((e) => {
    console.error('Failed to leave call', e);
  });
};
