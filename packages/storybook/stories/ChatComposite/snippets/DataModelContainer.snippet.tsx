import React, { useState, useEffect } from 'react';
import { ChatAdapter, ChatConfig, ChatComposite, createAzureCommunicationChatAdapter } from 'react-composites';

export interface ContosoChatContainerProps {
  config: ChatConfig | undefined;
  botUserId: string;
  botAvatar: string;
}

export const ContosoChatContainer = (props: ContosoChatContainerProps): JSX.Element => {
  const { config, botUserId, botAvatar } = props;

  // Creating an adapter is asynchronous.
  // An update to `config` triggers a new adapter creation, via the useEffect block.
  // When the adapter becomes ready, the state update triggers a re-render of the ChatComposite.
  const [adapter, setAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    if (config) {
      const createAdapter = async (): Promise<void> => {
        setAdapter(
          await createAzureCommunicationChatAdapter(
            config.token,
            config.endpointUrl,
            config.threadId,

            // Data model injection: The display name for the local user comes from Contoso's data model.
            config.displayName
          )
        );
      };
      createAdapter();
    }
  }, [config]);

  // Data model injection: Contoso provides avatars for the chat participants.
  // Unlike the displayName example above, this sets the avatar for the remote bot participant.
  const onRenderAvatar = (userId: string): JSX.Element => {
    if (userId === botUserId) {
      return <label>{botAvatar}</label>;
    }
    return <label>?</label>;
  };
  return <>{adapter ? <ChatComposite adapter={adapter} onRenderAvatar={onRenderAvatar} /> : <h3>Loading...</h3>}</>;
};
