// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Stack } from '@fluentui/react';
import {
  _DrawerMenu,
  _DrawerMenuItemProps,
  _useContainerHeight,
  _useContainerWidth,
  ParticipantMenuItemsCallback,
  useTheme
} from '@internal/react-components';
import React, { useMemo, useState } from 'react';
import { CallAdapter, CallControlOptions } from '../';
import { CallAdapterProvider } from '../adapter/CallAdapterProvider';
import { AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import {
  paneBodyContainer,
  scrollableContainer,
  scrollableContainerContents
} from '../../common/styles/ParticipantContainer.styles';
import { SidePaneHeader } from '../../common/SidePaneHeader';
import { ModalLocalAndRemotePIP } from '../../common/ModalLocalAndRemotePIP';
import { PeoplePaneContent } from '../../common/PeoplePaneContent';
import { drawerContainerStyles } from '../styles/CallComposite.styles';
import { TabHeader } from '../../common/TabHeader';
import { _ICoordinates } from '@internal/react-components';
import { _pxToRem } from '@internal/acs-ui-common';
import { useLocale } from '../../localization';
import { getPipStyles } from '../../common/styles/ModalLocalAndRemotePIP.styles';
import { useMinMaxDragPosition } from '../../common/utils';
import { availableSpaceStyles, hiddenStyles, sidePaneStyles, sidePaneTokens } from '../../common/styles/Pane.styles';
/* @conditional-compile-remove(PSTN-calls) */
import { PhoneNumberIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { useAdapter } from '../adapter/CallAdapterProvider';
import { isDisabled } from '../utils';
import { CallSidePaneOption } from '../hooks/useSidePaneState';

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
  activePane: CallSidePaneOption;
  mobileView?: boolean;
  inviteLink?: string;
  rtl?: boolean;
  callControls?: CallControlOptions;
}): JSX.Element => {
  const [drawerMenuItems, setDrawerMenuItems] = useState<_DrawerMenuItemProps[]>([]);

  const paneStyles = !props.activePane ? hiddenStyles : props.mobileView ? availableSpaceStyles : sidePaneStyles;
  const localeStrings = useLocale();

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getStrings = () => {
    /* @conditional-compile-remove(one-to-n-calling) */
    return localeStrings.strings.call;

    return localeStrings.strings.callWithChat;
  };

  const strings = getStrings();
  const theme = useTheme();

  const header = !props.activePane ? null : props.mobileView ? (
    <TabHeader
      {...props}
      strings={strings}
      activeTab={props.activePane}
      disablePeopleButton={isDisabled(props.callControls?.participantsButton)}
    />
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

  /* @conditional-compile-remove(PSTN-calls) */
  const addParticipantToCall = async (
    participant: PhoneNumberIdentifier,
    options?: AddPhoneNumberOptions
  ): Promise<void> => {
    await props.callAdapter.addParticipant(participant, options);
  };

  const minMaxDragPosition = useMinMaxDragPosition(props.modalLayerHostId, props.rtl);

  const pipStyles = useMemo(() => getPipStyles(theme), [theme]);

  const dataUiId = props.activePane === 'people' ? 'call-composite-people-pane' : '';

  /* @conditional-compile-remove(PSTN-calls) */
  const alternateCallerId = useAdapter().getState().alternateCallerId;

  return (
    <Stack verticalFill grow styles={paneStyles} data-ui-id={dataUiId} tokens={props.mobileView ? {} : sidePaneTokens}>
      {header}
      <Stack.Item verticalFill grow styles={paneBodyContainer}>
        <Stack horizontal styles={scrollableContainer}>
          <Stack.Item verticalFill styles={scrollableContainerContents}>
            <Stack styles={props.activePane === 'people' ? availableSpaceStyles : hiddenStyles}>
              <CallAdapterProvider adapter={props.callAdapter}>
                <PeoplePaneContent
                  {...props}
                  onRemoveParticipant={removeParticipantFromCall}
                  /* @conditional-compile-remove(PSTN-calls) */
                  onAddParticipant={addParticipantToCall}
                  setDrawerMenuItems={setDrawerMenuItems}
                  strings={strings}
                  /* @conditional-compile-remove(PSTN-calls) */
                  alternateCallerId={alternateCallerId}
                />
              </CallAdapterProvider>
            </Stack>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      {props.mobileView && (
        <CallAdapterProvider adapter={props.callAdapter}>
          <ModalLocalAndRemotePIP
            modalLayerHostId={props.modalLayerHostId}
            hidden={hidden}
            styles={pipStyles}
            minDragPosition={minMaxDragPosition.minDragPosition}
            maxDragPosition={minMaxDragPosition.maxDragPosition}
          />
        </CallAdapterProvider>
      )}
      {drawerMenuItems.length > 0 && (
        <Stack styles={drawerContainerStyles}>
          <_DrawerMenu onLightDismiss={() => setDrawerMenuItems([])} items={drawerMenuItems} />
        </Stack>
      )}
    </Stack>
  );
};
