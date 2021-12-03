import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallComposite,
  createAzureCommunicationCallAdapter,
  ChatAdapter,
  ChatComposite,
  createAzureCommunicationChatAdapter,
  fromFlatCommunicationIdentifier,
  CompositeLocale,
  CallCompositeOptions
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';

type CompositeProps = {
  // Required fields.
  userId: string; // '<Azure Communication Services Identifier>'
  token: string; // '<Azure Communication Services Access Token>'
  endpoint: string; // '<Azure Communication Services Resource Endpoint>'
  displayName: string; // '<Display Name>'
  callId: string; // '<Developer generated GUID>'
  threadId: string; // '<Get thread id from chat service>'

  // Optional fields for customizing composites.
  formFactor?: 'desktop' | 'mobile'; // '<Used to set the form factor for the calling composite>'
  fluentTheme?: PartialTheme | Theme; // '<Theming for the composites using FluentUi themes>'
  callInvitationURL?: string; // '<Invitation Url that will appear with a invite to call button>'
  locale?: CompositeLocale; // '<Sets Locale of buttons in the composites>'
  options?: CallCompositeOptions; // '<Set flags for visual elements of the chat composite>'
  errorBar?: boolean; // '<Hides and shows the Errorbar in the chat composite>'
  topic?: boolean; // '<Allows a topic to be set for the chat composite>'
};

const compositeProps: CompositeProps = {
  displayName: '<Display Name>',
  userId: '<Azure Communication Services Identifier>',
  token: '<Azure Communication Services Access Token>',
  endpoint: '<Azure Communication Services Resource Endpoint>',
  threadId: '<Get thread id from chat service>',
  callId: '<Developer generated GUID for the call>'
  // Other fields are optional inputs for customizing the composites themselves
};

function App(): JSX.Element {
  // Deconstruct the input props object
  const {
    userId,
    token,
    endpoint,
    displayName,
    callId,
    threadId,
    formFactor,
    fluentTheme,
    callInvitationURL,
    locale,
    options,
    errorBar,
    topic
  } = compositeProps;

  //Calling Variables
  const [callAdapter, setCallAdapter] = useState<CallAdapter>();

  //Chat Variables
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter>();

  // We can't even initialize the Chat and Call adapters without a well-formed token.
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [token]);

  useEffect(() => {
    if (credential !== undefined) {
      const createAdapter = async (credential: AzureCommunicationTokenCredential): Promise<void> => {
        setChatAdapter(
          await createAzureCommunicationChatAdapter({
            endpoint: endpoint,
            userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
            displayName: displayName,
            credential,
            threadId: threadId
          })
        );
        setCallAdapter(
          await createAzureCommunicationCallAdapter({
            userId: fromFlatCommunicationIdentifier(compositeProps.userId) as CommunicationUserIdentifier,
            displayName: displayName,
            credential: credential,
            locator: { meetingLink: callId }
          })
        );
      };
      createAdapter(credential);
    }
  }, [credential, displayName, endpoint, callId, threadId, userId]);

  if (!!callAdapter && !!chatAdapter) {
    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <div style={{ width: '50vw' }}>
          <ChatComposite
            adapter={chatAdapter}
            locale={locale}
            fluentTheme={fluentTheme}
            options={{
              errorBar: errorBar,
              topic: topic
            }}
          />
        </div>
        <div style={{ width: '50vw' }}>
          <CallComposite
            adapter={callAdapter}
            formFactor={formFactor}
            fluentTheme={fluentTheme}
            callInvitationUrl={callInvitationURL}
            locale={locale}
            options={options}
          />
        </div>
      </div>
    );
  }
  if (credential === undefined) {
    return <h3>Failed to construct credential. Provided token is malformed.</h3>;
  }
  return <h3>Initializing...</h3>;
}

export default App;
