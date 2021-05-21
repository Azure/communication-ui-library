import { ChatAdapter, ChatComposite, createAzureCommunicationChatAdapter } from '@azure/communication-react';
import React, { useState, useEffect, useCallback } from 'react';

export interface CustomDataModelExampleContainerProps {
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  botUserId: string;
  botAvatar: string;
}

export const CustomDataModelExampleContainer = (props: CustomDataModelExampleContainerProps): JSX.Element => {
  // Creating an adapter is asynchronous.
  // An update to `config` triggers a new adapter creation, via the useEffect block.
  // When the adapter becomes ready, the state update triggers a re-render of the ChatComposite.
  const [adapter, setAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    if (props) {
      const createAdapter = async (): Promise<void> => {
        setAdapter(
          await createAzureCommunicationChatAdapter(
            props.token,
            props.endpointUrl,
            props.threadId,

            // Data model injection: The display name for the local user comes from Contoso's data model.
            props.displayName
          )
        );
      };
      createAdapter();
    }
  }, [props]);

  // Data model injection: Contoso provides avatars for the chat participants.
  // Unlike the displayName example above, this sets the avatar for the remote bot participant.
  //
  // Although ChatComposite is not a pure react component, this callback may be passed on to
  // pure components lower in the Component tree.
  // Thus, it is best practice to memoize this with useCallback() to avoid spurious rendering.
  const onRenderAvatar = useCallback(
    (userId: string): JSX.Element => {
      if (userId === props.botUserId) {
        return <label>{props.botAvatar}</label>;
      }
      return <label>?</label>;
    },
    [props.botUserId, props.botAvatar]
  );
  return <>{adapter ? <ChatComposite adapter={adapter} onRenderAvatar={onRenderAvatar} /> : <h3>Loading...</h3>}</>;
};
