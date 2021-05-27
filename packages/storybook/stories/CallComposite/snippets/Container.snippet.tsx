import { CallComposite, CallAdapter, createAzureCommunicationCallAdapter } from '@azure/communication-react';
import { Theme, PartialTheme } from '@fluentui/react-theme-provider';
import React, { useState, useEffect } from 'react';

export type ContainerProps = {
  token: string;
  locator: string;
  displayName: string;
  fluentTheme?: PartialTheme | Theme;
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
          setAdapter(await createAzureCommunicationCallAdapter(props.token, callLocator, props.displayName));
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

  return <>{adapter && <CallComposite adapter={adapter} fluentTheme={props.fluentTheme} />}</>;
};
