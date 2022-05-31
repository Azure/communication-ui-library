// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IStackStyles, IStackTokens, ITheme, Stack, Theme } from '@fluentui/react';
import {
  _DrawerMenu,
  _DrawerMenuItemProps,
  _useContainerHeight,
  _useContainerWidth,
  ParticipantMenuItemsCallback,
  useTheme
} from '@internal/react-components';
import React, { useMemo, useRef, useState } from 'react';
import { CallAdapter } from '../CallComposite';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { ChatAdapter, ChatComposite, ChatCompositeProps } from '../ChatComposite';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import {
  paneBodyContainer,
  scrollableContainer,
  scrollableContainerContents
} from '../common/styles/ParticipantContainer.styles';
import { SidePaneHeader } from './SidePaneHeader';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { ModalLocalAndRemotePIP, ModalLocalAndRemotePIPStyles } from './ModalLocalAndRemotePIP';
import { PeoplePaneContent } from './PeoplePaneContent';
import { drawerContainerStyles } from './styles/CallWithChatCompositeStyles';
import { TabHeader } from './TabHeader';
/* @conditional-compile-remove(file-sharing) */
import { FileSharingOptions } from '../ChatComposite';
import { _ICoordinates } from '@internal/react-components';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 * `zIndex` to ensure that the `absolute` positioned chat pane is rendered
 * above the video gallery; and below the PiPiP modal.
 */
export const CHAT_PANE_Z_INDEX = 1;

/**
 * Pane that is used to store chat and people for CallWithChat composite
 * @private
 */
export const CallWithChatPane = (props: {
  chatCompositeProps: Partial<ChatCompositeProps>;
  callAdapter: CallAdapter;
  chatAdapter: ChatAdapter;
  onClose: () => void;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  onChatButtonClicked?: () => void;
  onPeopleButtonClicked?: () => void;
  modalLayerHostId: string;
  activePane: CallWithChatPaneOption;
  mobileView?: boolean;
  inviteLink?: string;
  /* @conditional-compile-remove(file-sharing) */
  fileSharing?: FileSharingOptions;
  rtl?: boolean;
}): JSX.Element => {
  const [drawerMenuItems, setDrawerMenuItems] = useState<_DrawerMenuItemProps[]>([]);

  const theme = useTheme();
  const hidden = props.activePane === 'none';
  const availableSpaceStylesMemo = useMemo(() => availableSpaceStyles(theme), [theme]);
  const paneStyles = hidden ? hiddenStyles : props.mobileView ? availableSpaceStylesMemo : sidePaneStyles;

  const callWithChatStrings = useCallWithChatCompositeStrings();

  const header =
    props.activePane === 'none' ? null : props.mobileView ? (
      <TabHeader {...props} activeTab={props.activePane} />
    ) : (
      <SidePaneHeader
        {...props}
        headingText={
          props.activePane === 'chat'
            ? callWithChatStrings.chatPaneTitle
            : props.activePane === 'people'
            ? callWithChatStrings.peoplePaneTitle
            : ''
        }
      />
    );

  const chatContent = (
    <ChatComposite
      {...props.chatCompositeProps}
      adapter={props.chatAdapter}
      fluentTheme={theme}
      options={{
        topic: false,
        /* @conditional-compile-remove(chat-composite-participant-pane) */
        participantPane: false,
        /* @conditional-compile-remove(file-sharing) */
        fileSharing: props.fileSharing
      }}
      onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
    />
  );

  const peopleContent = (
    <CallAdapterProvider adapter={props.callAdapter}>
      <PeoplePaneContent {...props} setDrawerMenuItems={setDrawerMenuItems} strings={callWithChatStrings} />
    </CallAdapterProvider>
  );

  // Use document.getElementById until Fluent's Stack supports componentRef property: https://github.com/microsoft/fluentui/issues/20410
  const modalLayerHostElement = document.getElementById(props.modalLayerHostId);
  const modalHostRef = useRef<HTMLElement>(modalLayerHostElement);
  const modalHostWidth = _useContainerWidth(modalHostRef);
  const modalHostHeight = _useContainerHeight(modalHostRef);
  const minDragPosition: _ICoordinates | undefined = useMemo(
    () =>
      modalHostWidth === undefined
        ? undefined
        : {
            x: props.rtl ? -1 * modalPipRightPositionPx : modalPipRightPositionPx - modalHostWidth + modalPipWidthPx,
            y: -1 * modalPipTopPositionPx
          },
    [modalHostWidth, props.rtl]
  );
  const maxDragPosition: _ICoordinates | undefined = useMemo(
    () =>
      modalHostWidth === undefined || modalHostHeight === undefined
        ? undefined
        : {
            x: props.rtl ? modalHostWidth - modalPipRightPositionPx - modalPipWidthPx : modalPipRightPositionPx,
            y: modalHostHeight - modalPipTopPositionPx - modalPipHeightPx
          },
    [modalHostHeight, modalHostWidth, props.rtl]
  );

  const pipStyles = useMemo(() => getPipStyles(theme), [theme]);

  const dataUiId =
    props.activePane === 'chat'
      ? 'call-with-chat-composite-chat-pane'
      : props.activePane === 'people'
      ? 'call-with-chat-composite-people-pane'
      : '';

  return (
    <Stack verticalFill grow styles={paneStyles} data-ui-id={dataUiId} tokens={props.mobileView ? {} : sidePaneTokens}>
      {header}
      <Stack.Item verticalFill grow styles={paneBodyContainer}>
        <Stack horizontal styles={scrollableContainer}>
          <Stack.Item verticalFill styles={scrollableContainerContents}>
            <Stack styles={props.activePane === 'chat' ? availableSpaceStylesMemo : hiddenStyles}>{chatContent}</Stack>
            <Stack styles={props.activePane === 'people' ? availableSpaceStylesMemo : hiddenStyles}>
              {peopleContent}
            </Stack>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      {props.mobileView && (
        <ModalLocalAndRemotePIP
          callAdapter={props.callAdapter}
          modalLayerHostId={props.modalLayerHostId}
          hidden={hidden}
          styles={pipStyles}
          minDragPosition={minDragPosition}
          maxDragPosition={maxDragPosition}
        />
      )}
      {drawerMenuItems.length > 0 && (
        <Stack styles={drawerContainerStyles}>
          <_DrawerMenu onLightDismiss={() => setDrawerMenuItems([])} items={drawerMenuItems} />
        </Stack>
      )}
    </Stack>
  );
};

/**
 * Active tab option type for {@link CallWithChatPane} component
 * @private
 */
export type CallWithChatPaneOption = 'none' | 'chat' | 'people';

const hiddenStyles: IStackStyles = {
  root: {
    display: 'none'
  }
};

const sidePaneStyles: IStackStyles = {
  root: {
    height: '100%',
    padding: '0.5rem 0.25rem',
    maxWidth: '21.5rem'
  }
};

const availableSpaceStyles = (theme: Theme): IStackStyles => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: CHAT_PANE_Z_INDEX,
    background: theme.palette.white
  }
});

const sidePaneTokens: IStackTokens = {
  childrenGap: '0.5rem'
};

const modalPipRightPositionPx = 16;
const modalPipTopPositionPx = 52;
const modalPipWidthPx = 88;
const modalPipHeightPx = 128;

const getPipStyles = (theme: ITheme): ModalLocalAndRemotePIPStyles => ({
  modal: {
    main: {
      borderRadius: theme.effects.roundedCorner4,
      boxShadow: theme.effects.elevation8,
      // Above the message thread / people pane.
      zIndex: 2,
      ...(theme.rtl ? { left: _pxToRem(modalPipRightPositionPx) } : { right: _pxToRem(modalPipRightPositionPx) }),
      top: _pxToRem(modalPipTopPositionPx)
    }
  }
});
