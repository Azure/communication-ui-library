import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  ChatAdapter,
  ChatComposite,
  COMPONENT_LOCALE_EN_US,
  CompositeLocale,
  COMPOSITE_LOCALE_EN_US,
  fromFlatCommunicationIdentifier,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';
import React, { useMemo } from 'react';

export type ContainerProps = {
  /** UserIdentifier is of type CommunicationUserIdentifier see below how to construct it from a string input */
  userIdentifier: string;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  locale?: CompositeLocale;
};

export const ContosoChatContainer = (props: ContainerProps): JSX.Element => {
  // Arguments to `useAzureCommunicationChatAdapter` must be memoized to avoid recreating adapter on each render.
  const credential = useMemo(() => new AzureCommunicationTokenCredential(props.token), [props.token]);

  const userId = useMemo(
    () => fromFlatCommunicationIdentifier(props.userIdentifier) as CommunicationUserIdentifier,
    [props.userIdentifier]
  );

  const adapter = useAzureCommunicationChatAdapter(
    {
      endpoint: props.endpointUrl,
      userId,
      // Data model injection: The display name for the local user comes from Contoso's data model.
      displayName: props.displayName,
      credential,
      threadId: props.threadId
    },
    // Custom behavior: Capitalize all messages before sending them.
    capitalizeMessageBeforeSend
  );

  const messageDateTimeLocale = (messageDate: Date): string => {
    let hours = messageDate.getHours();
    let minutes = messageDate.getMinutes().toString();
    let month = (messageDate.getMonth() + 1).toString();
    let day = messageDate.getDate().toString();
    const year = messageDate.getFullYear().toString();

    if (month.length === 1) {
      month = '0' + month;
    }
    if (day.length === 1) {
      day = '0' + day;
    }
    const isAm = hours < 12;
    if (hours > 12) {
      hours = hours - 12;
    }
    if (hours === 0) {
      hours = 12;
    }
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
    return (
      'TimeStamp: ' +
      year +
      '-' +
      month +
      '-' +
      day +
      ', ' +
      hours.toString() +
      ':' +
      minutes +
      ' ' +
      (isAm ? 'a.m.' : 'p.m.')
    );
  };

  const strings = props.locale?.component.strings ?? COMPONENT_LOCALE_EN_US.strings;
  const compositeStrings = props.locale?.strings ?? COMPOSITE_LOCALE_EN_US.strings;
  const messageDateTime = props.locale?.component.messageDateTimeLocale ?? messageDateTimeLocale;

  return (
    <>
      {adapter ? (
        <div style={{ height: '100vh', width: '100vw' }}>
          <ChatComposite
            adapter={adapter}
            locale={{ component: { strings, messageDateTimeLocale: messageDateTime }, strings: compositeStrings }}
          />
        </div>
      ) : (
        <h3>Loading...</h3>
      )}
    </>
  );
};

async function capitalizeMessageBeforeSend(adapter: ChatAdapter): Promise<ChatAdapter> {
  // Custom behavior: Intercept messages from the local user and convert
  // to uppercase before sending to backend.
  const sendMessage = adapter.sendMessage.bind(adapter);
  adapter.sendMessage = async (content: string): Promise<void> => {
    await sendMessage(content.toUpperCase());
  };
  return adapter;
}
