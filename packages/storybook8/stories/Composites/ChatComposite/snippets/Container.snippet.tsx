import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  ChatAdapter,
  ChatComposite,
  CompositeLocale,
  fromFlatCommunicationIdentifier,
  MessageProps,
  MessageRenderer
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import { ChatMessage as FluentChatMessage } from '@fluentui-contrib/react-chat';
import React, { useMemo, useEffect, useState } from 'react';
import { createStatefulClient } from './CustomStatefulClient';

export type ContainerProps = {
  /** UserIdentifier is of type CommunicationUserIdentifier see below how to construct it from a string input */
  userIdentifier: string;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  fluentTheme?: PartialTheme | Theme;
  rtl?: boolean;
  errorBar?: boolean;
  participants?: boolean;
  topic?: boolean;
  locale?: CompositeLocale;
  formFactor?: 'desktop' | 'mobile';
  richTextEditor?: boolean;
};

export const ContosoChatContainer = (props: ContainerProps): JSX.Element => {
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  const userId = useMemo(
    () => fromFlatCommunicationIdentifier(props.userIdentifier) as CommunicationUserIdentifier,
    [props.userIdentifier]
  );

  // Add throttling for setting display name during typing
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  useEffect(() => {
    const handle = setTimeout(() => {
      setDisplayName(props.displayName);
    }, 500);
    return () => clearTimeout(handle);
  }, [props.displayName]);

  const [adapter, setAdapter] = useState<ChatAdapter | undefined>(undefined);

  useEffect(() => {
    if (adapter) {
      return;
    }
    const createAdapter = async (): Promise<void> => {
      if (credential === undefined || displayName === undefined) {
        return;
      }
      const adapter = await createStatefulClient(
        userId.communicationUserId,
        displayName,
        props.endpointUrl,
        credential,
        props.threadId
      );
      console.log('Adapter created', adapter);

      setAdapter(adapter);
    };
    createAdapter();
  }, [
    adapter,
    credential,
    displayName,
    props.displayName,
    props.endpointUrl,
    props.threadId,
    userId.communicationUserId
  ]);

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <ChatComposite
          adapter={adapter}
          onRenderMessage={onRenderMessage}
          fluentTheme={props.fluentTheme}
          rtl={props.rtl ?? false}
          options={{
            errorBar: props.errorBar,
            participantPane: props.participants,
            topic: props.topic,
            richTextEditor: props.richTextEditor
          }}
          locale={props.locale}
        />
      </div>
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
};

export const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
  if (messageProps.message.messageType === 'custom') {
    // Custom rendering for bot messages
    return <FluentChatMessage author={'===Bot==='}>{messageProps.message.content}</FluentChatMessage>;
  }
  if (messageProps.message.messageType === 'chat' && messageProps.message.senderDisplayName === 'Bot') {
    // Custom rendering for bot messages
    return (
      <FluentChatMessage author={messageProps.message.senderDisplayName}>
        {messageProps.message.content}
      </FluentChatMessage>
    );
  }

  return defaultOnRender ? defaultOnRender(messageProps) : <></>;
};
