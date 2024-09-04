import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallComposite,
  ChatComposite,
  COMPOSITE_LOCALE_FR_FR,
  useAzureCommunicationCallAdapter,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';
import React, { useMemo } from 'react';

export type AppProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  locator: string;
};

export const App = (props: AppProps): JSX.Element => {
  // We can't even initialize the Chat and Call adapters without a well-formed token.
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  // Memoize arguments to `useAzureCommunicationCallAdapter` so that
  // a new adapter is only created when an argument changes.
  const locator = useMemo(
    () => (isTeamsMeetingLink(props.locator) ? { meetingLink: props.locator } : { groupId: props.locator }),
    [props.locator]
  );
  const callAdapter = useAzureCommunicationCallAdapter({
    userId: props.userId,
    displayName: props.displayName,
    credential,
    locator
  });

  const chatAdapter = useAzureCommunicationChatAdapter({
    endpoint: props.endpointUrl,
    userId: props.userId,
    displayName: props.displayName,
    credential,
    threadId: props.threadId
  });

  if (!!callAdapter && !!chatAdapter) {
    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <div style={{ width: '50vw' }}>
          <ChatComposite adapter={chatAdapter} locale={COMPOSITE_LOCALE_FR_FR} />
        </div>
        <div style={{ width: '50vw' }}>
          <CallComposite adapter={callAdapter} locale={COMPOSITE_LOCALE_FR_FR} />
        </div>
      </div>
    );
  }
  if (credential === undefined) {
    return <h3>Failed to construct credential. Provided token is malformed.</h3>;
  }
  return <h3>Initializing...</h3>;
};

const isTeamsMeetingLink = (link: string): boolean =>
  link.startsWith('https://teams.microsoft.com/meet/') || link.startsWith('https://teams.microsoft.com/l/meetup-join');
