import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  ChatComposite,
  COMPONENT_LOCALE_EN_US,
  CompositeLocale,
  COMPOSITE_LOCALE_EN_US,
  fromFlatCommunicationIdentifier,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';
import React, { useMemo } from 'react';
import { onDisplayDateTimeString } from './Utils';

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

  const adapter = useAzureCommunicationChatAdapter({
    endpoint: props.endpointUrl,
    userId,
    // Data model injection: The display name for the local user comes from Contoso's data model.
    displayName: props.displayName,
    credential,
    threadId: props.threadId
  });

  const strings = props.locale?.component.strings ?? COMPONENT_LOCALE_EN_US.strings;
  const compositeStrings = props.locale?.strings ?? COMPOSITE_LOCALE_EN_US.strings;
  const onDisplayDateTimeStringLocale = props.locale?.component.onDisplayDateTimeString ?? onDisplayDateTimeString;

  return (
    <>
      {adapter ? (
        <div style={{ height: '100vh', width: '100vw' }}>
          <ChatComposite
            adapter={adapter}
            locale={{
              component: { strings, onDisplayDateTimeString: onDisplayDateTimeStringLocale },
              strings: compositeStrings
            }}
          />
        </div>
      ) : (
        <h3>Loading...</h3>
      )}
    </>
  );
};
