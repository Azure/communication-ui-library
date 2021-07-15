import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { CallComposite, CallAdapter, createAzureCommunicationCallAdapter } from '@azure/communication-react';
import { Theme, PartialTheme } from '@fluentui/react';
import React, { useState, useEffect } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  locator: string;
  displayName: string;
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
};

const isTeamsMeetingLink = (link: string): boolean => link.startsWith('https://teams.microsoft.com/l/meetup-join');

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const [adapter, setAdapter] = useState<CallAdapter>();

  let credential: AzureCommunicationTokenCredential | undefined = undefined;
  try {
    credential = new AzureCommunicationTokenCredential(props.token);
  } catch {
    console.error('Failed to construct token credential');
  }

  useEffect(() => {
    (async () => {
      if (!!credential && props.locator && props.displayName) {
        const definedCredential = credential;
        const callLocator = isTeamsMeetingLink(props.locator)
          ? { meetingLink: props.locator }
          : { groupId: props.locator };
        const createAdapter = async (): Promise<void> => {
          setAdapter(
            await createAzureCommunicationCallAdapter(
              { kind: 'communicationUser', communicationUserId: props.userId.communicationUserId },
              props.displayName,
              definedCredential,
              callLocator
            )
          );
        };
        createAdapter();
      }
    })();
  }, [props, credential]);

  useEffect(() => {
    return () => {
      (async () => {
        if (!adapter) {
          return;
        }
        await adapter.leaveCall().catch((e) => {
          console.error('Failed to leave call', e);
        });
        adapter.dispose();
      })();
    };
  }, [adapter]);

  if (!!adapter) {
    return (
      <CallComposite adapter={adapter} fluentTheme={props.fluentTheme} callInvitationURL={props?.callInvitationURL} />
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
};
