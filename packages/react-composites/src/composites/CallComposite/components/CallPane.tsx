// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IStackStyles, IStackTokens, ITheme, Stack } from '@fluentui/react';
import {
  _DrawerMenu,
  _DrawerMenuItemProps,
  _useContainerHeight,
  _useContainerWidth,
  ParticipantMenuItemsCallback,
  useTheme
} from '@internal/react-components';
import React, { useMemo, useRef, useState } from 'react';
import { CallAdapter } from '../';
import { CallAdapterProvider } from '../adapter/CallAdapterProvider';
import { AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import {
  paneBodyContainer,
  scrollableContainer,
  scrollableContainerContents
} from '../../common/styles/ParticipantContainer.styles';
import { SidePaneHeader } from '../../common/SidePaneHeader';
import { ModalLocalAndRemotePIP, ModalLocalAndRemotePIPStyles } from '../../common/ModalLocalAndRemotePIP';
import { PeoplePaneContent } from '../../common/PeoplePaneContent';
import { drawerContainerStyles } from '../styles/CallComposite.styles';
import { TabHeader } from '../../common/TabHeader';
import { _ICoordinates } from '@internal/react-components';
import { _pxToRem } from '@internal/acs-ui-common';
import { useLocale } from '../../localization';

/**
 * Pane that is used to store participants for Call composite
 * @private
 */
/** @beta */
export const CallPane = (props: {
  callAdapter: CallAdapter;
  onClose: () => void;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  onPeopleButtonClicked?: () => void;
  modalLayerHostId: string;
  activePane: CallPaneOption;
  mobileView?: boolean;
  inviteLink?: string;
  rtl?: boolean;
}): JSX.Element => {
  const [drawerMenuItems, setDrawerMenuItems] = useState<_DrawerMenuItemProps[]>([]);

  const hidden = props.activePane === 'none';
  const paneStyles = hidden ? hiddenStyles : props.mobileView ? availableSpaceStyles : sidePaneStyles;
  const localeStrings = useLocale();

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useStrings = () => {
    /* @conditional-compile-remove(call-composite-participant-pane) */
    return localeStrings.strings.call;

    return localeStrings.strings.callWithChat;
  };

  const strings = useStrings();
  const theme = useTheme();

  const header =
    props.activePane === 'none' ? null : props.mobileView ? (
      <TabHeader {...props} strings={strings} activeTab={props.activePane} />
    ) : (
      <SidePaneHeader
        {...props}
        strings={strings}
        headingText={props.activePane === 'people' ? strings.peoplePaneTitle : ''}
      />
    );

  /**
   * In a Call Composite when a participant is removed, we must remove them from the call.
   */
  const removeParticipantFromCall = async (participantId: string): Promise<void> => {
    await props.callAdapter.removeParticipant(participantId);
  };

  const peopleContent = (
    <CallAdapterProvider adapter={props.callAdapter}>
      <PeoplePaneContent
        {...props}
        onRemoveParticipant={removeParticipantFromCall}
        setDrawerMenuItems={setDrawerMenuItems}
        strings={strings}
      />
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

  const dataUiId = props.activePane === 'people' ? 'call-composite-people-pane' : '';

  return (
    <Stack verticalFill grow styles={paneStyles} data-ui-id={dataUiId} tokens={props.mobileView ? {} : sidePaneTokens}>
      {header}
      <Stack.Item verticalFill grow styles={paneBodyContainer}>
        <Stack horizontal styles={scrollableContainer}>
          <Stack.Item verticalFill styles={scrollableContainerContents}>
            <Stack styles={props.activePane === 'people' ? availableSpaceStyles : hiddenStyles}>{peopleContent}</Stack>
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
 * Active tab option type for {@link CallPane} component
 * @private
 */
/** @beta */
export type CallPaneOption = 'none' | 'people';

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

const availableSpaceStyles: IStackStyles = { root: { width: '100%', height: '100%' } };

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
