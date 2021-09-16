/* eslint-disable prettier/prettier */
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallComposite,
  CallCompositeVisualElements,
  CompositeLocale,
  createAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import { features } from 'process';
import React, { useEffect, useMemo, useState } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  locator: string;
  displayName: string;
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  locale?: CompositeLocale;
  visualElements?: CallCompositeVisualElements;
};

const isTeamsMeetingLink = (link: string): boolean => link.startsWith('https://teams.microsoft.com/l/meetup-join');

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const [adapter, setAdapter] = useState<CallAdapter>();

  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  useEffect(() => {
    (async () => {
      if (!!credential && props.locator && props.displayName) {
        const callLocator = isTeamsMeetingLink(props.locator)
          ? { meetingLink: props.locator }
          : { groupId: props.locator };
        const createAdapter = async (credential: AzureCommunicationTokenCredential): Promise<void> => {
          setAdapter(
            await createAzureCommunicationCallAdapter({
              userId: { kind: 'communicationUser', communicationUserId: props.userId.communicationUserId },
              displayName: props.displayName,
              credential,
              locator: callLocator
            })
          );
        };
        createAdapter(credential);
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

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <CallComposite
          adapter={adapter}
          options={{
            errorBar: { visibility: true }, // { visibility: boolean, align: 'top' | 'bottom' }
            callControls: { visibility: true, align: 'top' }, // { visibility: boolean, align: 'top' | 'bottom' }
            dominantSpeaker: true
          }}
        />
      </div>
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
};
