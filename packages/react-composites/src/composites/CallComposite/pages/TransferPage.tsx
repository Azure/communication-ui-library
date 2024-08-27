// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Spinner, SpinnerSize, Stack, Text, mergeStyles } from '@fluentui/react';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ErrorBar } from '@internal/react-components';
import { Announcer } from '@internal/react-components';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useEffect } from 'react';
import { AvatarPersona, AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { useLocale } from '../../localization';
import { CallArrangement } from '../components/CallArrangement';
import { usePropsFor } from '../hooks/usePropsFor';
import { useSelector } from '../hooks/useSelector';
import { getRemoteParticipants } from '../selectors/baseSelectors';
import { getTransferCall } from '../selectors/baseSelectors';
import {
  avatarStyles,
  defaultPersonaStyles,
  displayNameStyles,
  pageContainer,
  spinnerStyles,
  statusTextStyles,
  tileContainerStyles,
  tileContentStyles
} from '../styles/TransferPage.styles';
import { reduceCallControlsForMobile } from '../utils';
import { LobbyPageProps } from './LobbyPage';

// Which should be participant shown in the transfer page
type TransferPageSubject = 'transferor' | 'transferTarget';

/**
 * @private
 */
export const TransferPage = (
  props: LobbyPageProps & {
    /** Callback function that can be used to provide custom data to Persona Icon rendered */
    onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  }
): JSX.Element => {
  const errorBarProps = usePropsFor(ErrorBar);
  const strings = useLocale().strings.call;
  const remoteParticipants = useSelector(getRemoteParticipants);
  const transferCall = useSelector(getTransferCall);

  const [announcerString, setAnnouncerString] = useState<string | undefined>(undefined);

  // Reduce the controls shown when mobile view is enabled.
  const callControlOptions = props.mobileView
    ? reduceCallControlsForMobile(props.options?.callControls)
    : props.options?.callControls;

  const transferor = useMemo(
    () => (remoteParticipants ? Object.values(remoteParticipants)?.[0] : undefined),
    [remoteParticipants]
  );
  const transferTarget = useMemo(
    () => (transferCall?.remoteParticipants ? Object.values(transferCall.remoteParticipants)?.[0] : undefined),
    [transferCall]
  );

  const pageSubject: TransferPageSubject = useMemo(() => {
    if (transferCall && transferTarget?.displayName) {
      return 'transferTarget';
    }
    return 'transferor';
  }, [transferCall, transferTarget?.displayName]);

  useEffect(() => {
    setAnnouncerString(strings.transferPageNoticeString);
  }, [strings.transferPageNoticeString]);

  let transferTileParticipant = transferor;
  if (pageSubject === 'transferTarget') {
    transferTileParticipant = transferTarget;
  }

  let transferParticipantDisplayName = transferor?.displayName ?? strings.transferPageUnknownTransferorDisplayName;
  if (pageSubject === 'transferTarget') {
    transferParticipantDisplayName =
      transferTarget?.displayName ?? strings.transferPageUnknownTransferTargetDisplayName;
  }

  return (
    <Stack className={mergeStyles(pageContainer)}>
      <Announcer announcementString={announcerString} ariaLive="polite" />
      <CallArrangement
        complianceBannerProps={{ strings }}
        // Ignore errors from before current call. This avoids old errors from showing up when a user re-joins a call.
        errorBarProps={props.options?.errorBar !== false && errorBarProps}
        showErrorNotifications={props.options?.errorBar ?? true}
        callControlProps={{
          options: callControlOptions,
          increaseFlyoutItemSize: props.mobileView
        }}
        mobileView={props.mobileView}
        modalLayerHostId={props.modalLayerHostId}
        onRenderGalleryContent={() => (
          <TransferTile
            userId={
              transferTileParticipant ? toFlatCommunicationIdentifier(transferTileParticipant?.identifier) : undefined
            }
            displayName={transferParticipantDisplayName}
            initialsName={transferParticipantDisplayName}
            statusText={
              pageSubject === 'transferTarget'
                ? strings.transferPageTransferTargetText
                : strings.transferPageTransferorText
            }
            onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
          />
        )}
        dataUiId={'transfer-page'}
        updateSidePaneRenderer={props.updateSidePaneRenderer}
        mobileChatTabHeader={props.mobileChatTabHeader}
        latestErrors={props.latestErrors}
        onDismissError={props.onDismissError}
        onDismissNotification={props.onDismissNotification}
        latestNotifications={props.latestNotifications}
        /* @conditional-compile-remove(call-readiness) */
        doNotShowCameraAccessNotifications={props.options?.deviceChecks?.camera === 'doNotPrompt'}
      />
    </Stack>
  );
};

interface TransferTileProps {
  /** React Child components. Child Components will show as overlay component in the VideoTile. */
  children?: React.ReactNode;
  /** User id for `onFetchAvatarPersonaData` callback to provide custom data to avatars rendered */
  userId?: string;
  /** Callback function that can be used to provide custom data to Persona Icon rendered */
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  /**
   * Display name of the transferor or transfer target to be shown in the label.
   * @remarks `displayName` is used to generate avatar initials if `initialsName` is not provided.
   */
  displayName?: string;
  /**
   * Name of the transferor or transfer target used to generate initials for the avatar. For example, a name
   * `John Doe` will display `JD` as initials.
   * @remarks `displayName` is used if this property is not specified.
   */
  initialsName?: string;
  /** Optional property to set the status of the transfer process */
  statusText?: string;
}

const TransferTile = (props: TransferTileProps): JSX.Element => {
  const { displayName, initialsName, userId, onFetchAvatarPersonaData, statusText } = props;

  const [personaSize, setPersonaSize] = useState<number>();
  const tileRef = useRef<HTMLDivElement>(null);

  const observer = useRef(
    new ResizeObserver((entries): void => {
      const { width, height } = entries[0].contentRect;
      const personaSize = Math.min(width, height) / 2;
      setPersonaSize(Math.max(Math.min(personaSize, 150), 32));
    })
  );

  useLayoutEffect(() => {
    if (tileRef.current) {
      observer.current.observe(tileRef.current);
    }
    const currentObserver = observer.current;
    return () => currentObserver.disconnect();
  }, [observer, tileRef]);

  const placeholderOptions = useMemo(
    () => ({
      userId,
      text: initialsName ?? displayName,
      coinSize: personaSize,
      styles: defaultPersonaStyles,
      hidePersonaDetails: true
    }),
    [userId, initialsName, displayName, personaSize]
  );

  const defaultOnRenderAvatar = useCallback(() => {
    return personaSize ? (
      <AvatarPersona
        {...placeholderOptions}
        dataProvider={onFetchAvatarPersonaData}
        className={mergeStyles(avatarStyles)}
      />
    ) : (
      <></>
    );
  }, [placeholderOptions, onFetchAvatarPersonaData, personaSize]);

  const defaultAvatar = useMemo(() => defaultOnRenderAvatar(), [defaultOnRenderAvatar]);

  return (
    <div ref={tileRef} className={mergeStyles(tileContainerStyles)} data-is-focusable={true}>
      <Stack className={mergeStyles(tileContentStyles)} tokens={{ childrenGap: '1rem' }}>
        <Stack horizontalAlign="center" tokens={{ childrenGap: '0.5rem' }}>
          {defaultAvatar}
          <Text className={mergeStyles(displayNameStyles)}>{displayName}</Text>
        </Stack>
        <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={{ childrenGap: '0.5rem' }}>
          <Spinner size={SpinnerSize.large} className={mergeStyles(spinnerStyles)} />
          <Text className={mergeStyles(statusTextStyles)}>{statusText}</Text>
        </Stack>
      </Stack>
    </div>
  );
};
