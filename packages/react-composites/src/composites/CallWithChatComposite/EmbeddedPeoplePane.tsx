// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { DefaultButton, PrimaryButton, Stack } from '@fluentui/react';
import { ParticipantList } from '@internal/react-components';
import copy from 'copy-to-clipboard';
import React, { useMemo } from 'react';
import { CallAdapter } from '../CallComposite';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { ChatAdapter } from '../ChatComposite';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { CallWithChatCompositeIcon } from '../common/icons';
import { ParticipantListWithHeading } from '../common/ParticipantContainer';
import { peoplePaneContainerTokens } from '../common/styles/ParticipantContainer.styles';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { MobilePane } from './MobilePane';
import { SidePane } from './SidePane';
import { copyLinkButtonStyles, linkIconStyles } from './styles/EmbeddedPeoplePane.styles';

/**
 * @private
 */
export const EmbeddedPeoplePane = (props: {
  inviteLink?: string;
  onClose: () => void;
  hidden: boolean;
  callAdapter: CallAdapter;
  chatAdapter: ChatAdapter;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onChatButtonClick: () => void;
  onPeopleButtonClick: () => void;
  mobileView?: boolean;
}): JSX.Element => {
  const { callAdapter, chatAdapter, inviteLink } = props;
  const participantListDefaultProps = usePropsFor(ParticipantList);

  const callWithChatStrings = useCallWithChatCompositeStrings();

  const participantListProps = useMemo(() => {
    const onRemoveParticipant = async (participantId: string): Promise<void> =>
      removeParticipantFromCallWithChat(callAdapter, chatAdapter, participantId);
    return {
      ...participantListDefaultProps,
      onRemoveParticipant
    };
  }, [participantListDefaultProps, callAdapter, chatAdapter]);

  const participantList = (
    <ParticipantListWithHeading
      participantListProps={participantListProps}
      onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
      title={callWithChatStrings.peoplePaneSubTitle}
    />
  );

  if (props.mobileView) {
    return (
      <MobilePane
        hidden={props.hidden}
        dataUiId={'call-with-chat-composite-people-pane'}
        onClose={props.onClose}
        activeTab="people"
        onChatButtonClicked={props.onChatButtonClick}
        onPeopleButtonClicked={props.onPeopleButtonClick}
      >
        <Stack verticalFill tokens={peoplePaneContainerTokens}>
          {participantList}
          {inviteLink && (
            <PrimaryButton
              onClick={() => copy(inviteLink)}
              styles={copyLinkButtonStyles}
              onRenderIcon={() => <CallWithChatCompositeIcon iconName="Link" style={linkIconStyles} />}
              text="Copy invite link"
            />
          )}
        </Stack>
      </MobilePane>
    );
  }

  return (
    <SidePane
      hidden={props.hidden}
      headingText={callWithChatStrings.peoplePaneTitle}
      onClose={props.onClose}
      dataUiId={'call-with-chat-composite-people-pane'}
    >
      <Stack tokens={peoplePaneContainerTokens}>
        {inviteLink && (
          <DefaultButton
            text="Copy invite link"
            iconProps={{ iconName: safeGetLinkIconName() }}
            onClick={() => copy(inviteLink)}
          />
        )}
        {participantList}
      </Stack>
    </SidePane>
  );
};

// Remove safe getter when conditional-compile-remove(call-with-chat-composite) is removed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safeGetLinkIconName = (): any => 'Link';

/**
 * In a CallWithChat when a participant is removed, we must remove them from both
 * the call and the chat thread.
 */
const removeParticipantFromCallWithChat = async (
  callAdapter: CallAdapter,
  chatAdapter: ChatAdapter,
  participantId: string
): Promise<void> => {
  await callAdapter.removeParticipant(participantId);
  await chatAdapter.removeParticipant(participantId);
};
