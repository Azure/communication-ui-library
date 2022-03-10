// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { concatStyleSets, IStackStyles, Stack } from '@fluentui/react';
import { ParticipantMenuItemsCallback, useTheme } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallAdapter } from '../CallComposite';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { ChatAdapter, ChatCompositeProps } from '../ChatComposite';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import {
  paneBodyContainer,
  scrollableContainer,
  scrollableContainerContents
} from '../common/styles/ParticipantContainer.styles';
import { BasicHeader } from './BasicHeader';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { ChatContent } from './ChatContent';
import { PeopleContent } from './PeopleContent';
import { TabHeader } from './TabHeader';
import { WithLocalAndRemotePIP, WithLocalAndRemotePIPStyles } from './WithLocalAndRemotePIP';

/**
 * @private
 */
export const Pane = (props: {
  chatCompositeProps: Partial<ChatCompositeProps>;
  callAdapter: CallAdapter;
  chatAdapter: ChatAdapter;
  onClose: () => void;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
  modalLayerHostId: string;
  activePane: 'chat' | 'people' | 'none';
  mobileView?: boolean;
  inviteLink?: string;
}): JSX.Element => {
  const paneStyles = props.mobileView
    ? props.activePane === 'none'
      ? hiddenMobilePaneStyle
      : mobilePaneStyle
    : props.activePane === 'none'
    ? sidePaneContainerHiddenStyles
    : sidePaneContainerStyles;

  const callWithChatStrings = useCallWithChatCompositeStrings();
  const theme = useTheme();

  const header =
    props.activePane === 'none' ? null : props.mobileView ? (
      <TabHeader {...props} activeTab={props.activePane} />
    ) : (
      <BasicHeader
        {...props}
        headingText={
          props.activePane === 'chat' ? callWithChatStrings.chatPaneTitle : callWithChatStrings.peoplePaneTitle
        }
      />
    );

  const content =
    props.activePane === 'chat' ? (
      <ChatContent {...props} fluentTheme={theme} />
    ) : (
      <CallAdapterProvider adapter={props.callAdapter}>
        <PeopleContent {...props} strings={callWithChatStrings} />
      </CallAdapterProvider>
    );

  const pipStyles: WithLocalAndRemotePIPStyles = useMemo(
    () => ({
      modal: {
        main: {
          borderRadius: theme.effects.roundedCorner4,
          boxShadow: theme.effects.elevation8,
          ...(theme.rtl ? { left: '1rem' } : { right: '1rem' })
        }
      }
    }),
    [theme]
  );

  return (
    <Stack
      verticalFill
      grow
      styles={paneStyles}
      data-ui-id={
        props.activePane === 'chat' ? 'call-with-chat-composite-chat-pane' : 'call-with-chat-composite-people-pane'
      }
    >
      {header}
      <Stack.Item verticalFill grow styles={paneBodyContainer}>
        <Stack horizontal styles={scrollableContainer}>
          <Stack.Item verticalFill styles={scrollableContainerContents}>
            {content}
          </Stack.Item>
        </Stack>
      </Stack.Item>
      {props.mobileView && (
        <WithLocalAndRemotePIP
          callAdapter={props.callAdapter}
          modalLayerHostId={props.modalLayerHostId}
          hidden={props.activePane === 'none'}
          styles={pipStyles}
        />
      )}
    </Stack>
  );
};

/**
 * @private
 */
export const sidePaneContainerStyles: IStackStyles = {
  root: {
    height: '100%',
    padding: '0.5rem 0.25rem',
    width: '21.5rem'
  }
};

/**
 * @private
 */
export const sidePaneContainerHiddenStyles: IStackStyles = {
  root: {
    ...sidePaneContainerStyles,
    display: 'none'
  }
};

/**
 * @private
 */
export const mobilePaneStyle: IStackStyles = { root: { width: '100%', height: '100%' } };

/**
 * @private
 */
export const hiddenMobilePaneStyle: IStackStyles = concatStyleSets(mobilePaneStyle, { root: { display: 'none' } });
