// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { DefaultButton, PrimaryButton, Stack } from '@fluentui/react';
import { ParticipantList } from '@internal/react-components';
import copy from 'copy-to-clipboard';
import React, { useMemo } from 'react';
import { CallAdapter } from '../CallComposite';
import { LocalAndRemotePIP } from '../CallComposite/components/LocalAndRemotePIP';
import { useHandlers } from '../CallComposite/hooks/useHandlers';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { useSelector } from '../CallComposite/hooks/useSelector';
import { localAndRemotePIPSelector } from '../CallComposite/selectors/localAndRemotePIPSelector';
import { ChatAdapter } from '../ChatComposite';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { CallWithChatCompositeIcon } from '../common/icons';
import { ParticipantListWithHeading } from '../common/ParticipantContainer';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { MobilePane } from './MobilePane';
import { SidePane } from './SidePane';
import {
  copyLinkButtonContainerStyles,
  copyLinkButtonStyles,
  linkIconStyles,
  localAndRemotePIPStyles,
  peoplePaneContainerTokens
} from './styles/EmbeddedPeoplePane.styles';

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

  const pictureInPictureProps = useSelector(localAndRemotePIPSelector);
  const pictureInPictureHandlers = useHandlers(LocalAndRemotePIP);

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
          <Stack.Item>{participantList}</Stack.Item>
          {
            // Only render LocalAndRemotePIP when this component is NOT hidden because VideoGallery needs to have
            // possession of the dominant remote participant video stream
            !props.hidden && (
              <Stack horizontalAlign="end" grow>
                <Stack styles={localAndRemotePIPStyles}>
                  <LocalAndRemotePIP {...pictureInPictureProps} {...pictureInPictureHandlers} />
                </Stack>
              </Stack>
            )
          }
          {inviteLink && (
            <Stack.Item styles={copyLinkButtonContainerStyles}>
              <PrimaryButton
                onClick={() => copy(inviteLink)}
                styles={copyLinkButtonStyles}
                onRenderIcon={() => <LinkIconTrampoline />}
                text="Copy invite link"
              />
            </Stack.Item>
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
          <DefaultButton text="Copy invite link" iconProps={{ iconName: 'Link' }} onClick={() => copy(inviteLink)} />
        )}
        {participantList}
      </Stack>
    </SidePane>
  );
};

const LinkIconTrampoline = (): JSX.Element => {
  // @conditional-compile-remove(call-with-chat-composite)
  return <CallWithChatCompositeIcon iconName="Link" style={linkIconStyles} />;

  // Return _something_ in stable builds to satisfy build system
  return <CallWithChatCompositeIcon iconName="ControlButtonEndCall" style={linkIconStyles} />;
};

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
