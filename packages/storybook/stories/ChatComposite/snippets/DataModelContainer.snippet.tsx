import React, { useState, useEffect, useMemo } from 'react';
import { ChatAdapter, ChatConfig, ChatComposite, createAzureCommunicationChatAdapter } from 'react-composites';

export interface ContosoChatContainerProps {
  config: ChatConfig | undefined;
  // User ID of the local user.
  userId: string;
  // Avatar to use for the local user.
  avatar: string;
}

export const ContosoChatContainer = (props: ContosoChatContainerProps): JSX.Element => {
  const { config, userId: myUserId, avatar } = props;

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
            config.displayName
          )
        );
      };
      createAdapter();
    }
  }, [config]);

  const onRenderAvatar = (targetUserId: string): JSX.Element => {
    if (targetUserId === myUserId) {
      return <label>{avatar}</label>;
    }
    return <label>?</label>;
  };
  return <>{adapter ? <ChatComposite adapter={adapter} onRenderAvatar={onRenderAvatar} /> : <h3>Loading...</h3>}</>;
};
