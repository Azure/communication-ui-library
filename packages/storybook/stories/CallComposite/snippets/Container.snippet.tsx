import { CallComposite, CallAdapter, createAzureCommunicationCallAdapter } from '@azure/communication-react';
import React, { useState, useEffect } from 'react';

export type ContainerProps = {
  token: string;
  locator: string;
  displayName: string;
};

const isTeamsMeetingLink = (link: string): boolean => link.startsWith('https://teams.microsoft.com/l/meetup-join');
export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const [adapter, setAdapter] = useState<CallAdapter>();

  useEffect(() => {
    (async () => {
      if (props.token && props.locator) {
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

  // FIXME: There is still a small chance of adapter leak:
  // - props change triggers the `useEffect` block that queues async adapter creation
  // - Component unmounts, the following `useEffect` clean up runs but finds an undefined adapter
  // - async adapter creation succeeds -- adapter is created, and leaked.
  //
  // In this scenario, the adapter is never used to join a call etc. but there is still a memory leak.
  useEffect(() => {
    return () => {
      (async () => {
        if (!adapter) {
          return;
        }
        await adapter.leaveCall();
        adapter.dispose();
      })();
    };
  }, [adapter]);

  return <>{adapter && <CallComposite adapter={adapter} />}</>;
};
