import React, { useState, useEffect } from 'react';
import { CallComposite, CallAdapter, createAzureCommunicationCallAdapter } from 'react-composites';

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
    return () => {
      console.log('Kicking off cleanup');
      if (adapter) {
        console.log('disposing');
        adapter.dispose();
      }

      /*
      (async () => {
        console.log('Running cleanup');
        // TODO(prprabhu) What if the async creation hasn't completed yet?
        if (!adapter) {
          return;
        }
        console.log('Leaving call');
        await adapter.leaveCall();
        adapter.dispose();
      })();
      */
    };
  }, [props]);

  return <>{adapter && <CallComposite adapter={adapter} />}</>;
};
