// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { concatStyleSets, DefaultButton, Stack } from '@fluentui/react';
import { ChevronLeft28Regular } from '@fluentui/react-icons';
import { ParticipantList, useTheme } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallAdapter } from '../CallComposite';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { ChatAdapter, ChatComposite } from '../ChatComposite';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { ParticipantListWithHeading } from '../common/ParticipantContainer';
import {
  chatAndPeoplePaneButtonStyles,
  chatAndPeoplePaneCloseButtonStyles,
  chatAndPeoplePaneContentHiddenStyle,
  chatAndPeoplePaneContentStyle,
  chatAndPeoplePaneControlBarStyle,
  chatAndPeoplePaneHiddenStyle,
  chatAndPeoplePaneStyle
} from './styles/ChatAndPeoplePaneStyles';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { removeParticipantFromCallWithChat } from './SidePane';

export const ChatAndPeoplePane = (props: {
  chatAdapter: ChatAdapter;
  callAdapter: CallAdapter;
  closePane: () => void;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
  activeTab?: ChatAndPeoplePaneTab;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
}): JSX.Element => {
  const {
    chatAdapter,
    callAdapter,
    closePane,
    onChatButtonClicked,
    onPeopleButtonClicked,
    onFetchAvatarPersonaData,
    activeTab
  } = props;

  const theme = useTheme();
  const strings = useCallWithChatCompositeStrings();
  const chatAndPeoplePaneButtonStylesThemed = concatStyleSets(chatAndPeoplePaneButtonStyles, {
    rootChecked: {
      borderBottom: `0.125rem solid ${theme.palette.themePrimary}`
    }
  });

  return (
    <Stack verticalFill grow className={activeTab ? chatAndPeoplePaneStyle : chatAndPeoplePaneHiddenStyle}>
      <Stack horizontal grow className={chatAndPeoplePaneControlBarStyle}>
        <DefaultButton
          onClick={closePane}
          styles={chatAndPeoplePaneCloseButtonStyles}
          onRenderIcon={() => <ChevronLeft28Regular />}
        ></DefaultButton>
        <DefaultButton
          onClick={() => {
            onChatButtonClicked();
          }}
          styles={chatAndPeoplePaneButtonStylesThemed}
          checked={activeTab === 'chat'}
        >
          {strings.chatButtonLabel}
        </DefaultButton>
        <DefaultButton
          onClick={() => {
            onPeopleButtonClicked();
          }}
          styles={chatAndPeoplePaneButtonStylesThemed}
          checked={activeTab === 'people'}
        >
          {strings.peopleButtonLabel}
        </DefaultButton>
      </Stack>
      <Stack.Item
        className={activeTab === 'people' ? chatAndPeoplePaneContentStyle : chatAndPeoplePaneContentHiddenStyle}
      >
        <CallAdapterProvider adapter={callAdapter}>
          <CallWithChatParticipantListWithHeading
            chatAdapter={chatAdapter}
            callAdapter={callAdapter}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          ></CallWithChatParticipantListWithHeading>
        </CallAdapterProvider>
      </Stack.Item>
      <Stack.Item
        className={activeTab === 'chat' ? chatAndPeoplePaneContentStyle : chatAndPeoplePaneContentHiddenStyle}
      >
        <ChatComposite
          adapter={chatAdapter}
          fluentTheme={theme}
          options={{ topic: false, participantPane: false }}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
        />
      </Stack.Item>
    </Stack>
  );
};

/**
 * Active tab type for {@link ChatAndPeoplePane}
 * @private
 */
type ChatAndPeoplePaneTab = 'chat' | 'people';

/**
 * {@link ParticipantListWithHeading} that handles participant operations for CallWithChat
 * @private
 */
export const CallWithChatParticipantListWithHeading = (props: {
  callAdapter: CallAdapter;
  chatAdapter: ChatAdapter;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
}): JSX.Element => {
  const { callAdapter, chatAdapter } = props;
  const participantListDefaultProps = usePropsFor(ParticipantList);

  const strings = useCallWithChatCompositeStrings();

  const participantListProps = useMemo(() => {
    const onRemoveParticipant = async (participantId: string): Promise<void> =>
      removeParticipantFromCallWithChat(callAdapter, chatAdapter, participantId);
    return {
      ...participantListDefaultProps,
      onRemoveParticipant
    };
  }, [participantListDefaultProps, callAdapter, chatAdapter]);

  return (
    <ParticipantListWithHeading
      participantListProps={participantListProps}
      onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
      title={strings.peoplePaneSubTitle}
    />
  );
};
