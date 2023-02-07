import { ChatParticipant } from '@azure/communication-chat';
import { ChatComposite, CompositeLocale } from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
// eslint-disable-next-line no-restricted-imports
import { useFakeChatAdapters } from '@internal/react-composites/../tests/app/lib/useFakeChatAdapters';
import React, { useMemo, useEffect } from 'react';
// import { useFakeChatAdapters } from '../../../../react-composites/tests/app/lib/useFakeChatAdapters';
import { sendMessagesAsBotWithAdapter } from './Utils';

export type ContainerProps = {
  displayName: string;
  topic: string;
  fluentTheme?: PartialTheme | Theme;
  errorBar?: boolean;
  showParticipants?: boolean;
  showTopic?: boolean;
  locale?: CompositeLocale;
  formFactor?: 'desktop' | 'mobile';
  messages: string[];
};

export const ContosoChatContainer = (props: ContainerProps): JSX.Element => {
  const chatAdapterArgs = useMemo(() => {
    const localParticipant: ChatParticipant = {
      id: { communicationUserId: 'localId' },
      displayName: props.displayName
    };
    const botParticipant: ChatParticipant = {
      id: { communicationUserId: 'remoteId' },
      displayName: 'A simple bot'
    };
    return {
      topic: props.topic,
      localParticipant: localParticipant,
      remoteParticipants: [botParticipant],
      participantsWithHiddenComposites: [botParticipant]
    };
  }, [props.displayName, props.topic]);

  const fakeAdapter = useFakeChatAdapters(chatAdapterArgs);

  useEffect(() => {
    if (fakeAdapter?.remotes[0]) {
      sendMessagesAsBotWithAdapter(fakeAdapter?.remotes[0], props.messages);
    }
  }, [fakeAdapter?.remotes, props.messages]);

  if (fakeAdapter?.local && props.topic) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <ChatComposite
          adapter={fakeAdapter.local}
          fluentTheme={props.fluentTheme}
          options={{
            topic: props.showTopic,
            participantPane: props.showParticipants
          }}
          locale={props.locale}
          formFactor={props.formFactor}
        />
      </div>
    );
  }
  return <>Initializing...</>;
};
