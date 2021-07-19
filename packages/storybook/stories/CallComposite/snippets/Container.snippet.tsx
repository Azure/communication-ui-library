import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallComposite,
  CallAdapter,
  CallOptions,
  createAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { Theme, PartialTheme } from '@fluentui/react';
import React, { useState, useEffect } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  locator: string;
  displayName: string;
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  options?: CallOptions;
};

const isTeamsMeetingLink = (link: string): boolean => link.startsWith('https://teams.microsoft.com/l/meetup-join');

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const [adapter, setAdapter] = useState<CallAdapter>();

  useEffect(() => {
    (async () => {
      if (props.token && props.locator && props.displayName) {
        const callLocator = isTeamsMeetingLink(props.locator)
          ? { meetingLink: props.locator }
          : { groupId: props.locator };
        const createAdapter = async (): Promise<void> => {
          setAdapter(
            await createAzureCommunicationCallAdapter(
              { kind: 'communicationUser', communicationUserId: props.userId.communicationUserId },
              props.displayName,
              new AzureCommunicationTokenCredential(props.token),
              callLocator
            )
          );
        };
        createAdapter();
      }
    })();
  }, [props]);

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

  return (
    <>
      {adapter && (
        <CallComposite
          adapter={adapter}
          fluentTheme={props.fluentTheme}
          callInvitationURL={props?.callInvitationURL}
          options={props?.options}
        />
      )}
    </>
  );
};
