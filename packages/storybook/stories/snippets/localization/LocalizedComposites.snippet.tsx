import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallComposite,
  ChatComposite,
  ChatAdapter,
  createAzureCommunicationChatAdapter,
  COMPOSITE_LOCALE_FR_FR,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import React, { useEffect, useMemo, useState } from 'react';

export type AppProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  locator: string;
};

export const App = (props: AppProps): JSX.Element => {
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter>();

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
  useEffect(() => {
    const createAdapter = async (): Promise<void> => {
      setChatAdapter(
        await createAzureCommunicationChatAdapter({
          endpoint: props.endpointUrl,
          userId: props.userId,
          displayName: props.displayName,
          credential: new AzureCommunicationTokenCredential(props.token),
          threadId: props.threadId
        })
      );
    };
    createAdapter();
  }, [props]);

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

const isTeamsMeetingLink = (link: string): boolean => link.startsWith('https://teams.microsoft.com/l/meetup-join');
