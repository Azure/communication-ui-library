// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Spinner, SpinnerSize, Stack, Text, mergeStyles } from '@fluentui/react';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ErrorBar, OnRenderAvatarCallback } from '@internal/react-components';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AvatarPersona, AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { useLocale } from '../../localization';
import { CallArrangement } from '../components/CallArrangement';
import { usePropsFor } from '../hooks/usePropsFor';
import { useSelector } from '../hooks/useSelector';
import { getRemoteParticipants } from '../selectors/baseSelectors';
/* @conditional-compile-remove(call-transfer) */
import { getTransferCall } from '../selectors/baseSelectors';
import {
  defaultPersonaStyles,
  displayNameStyles,
  spinnerStyles,
  statusTextStyles,
  tileContainerStyles,
  tileContentStyles
} from '../styles/TransferPage.styles';
import { reduceCallControlsForMobile } from '../utils';
import { LobbyPageProps } from './LobbyPage';

/* @conditional-compile-remove(call-transfer) */
type TransferPageSubject = 'transferor' | 'transferTarget';

/**
 * @private
 */
export const TransferPage = (
  props: LobbyPageProps & {
    /** Render component function to replace the default Persona Icon representing the transferor or transfer target. */
    onRenderAvatar?: OnRenderAvatarCallback;
    /** Callback function that can be used to provide custom data to Persona Icon rendered */
    onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  }
): JSX.Element => {
  const errorBarProps = usePropsFor(ErrorBar);
  const strings = useLocale().strings.call;
  const remoteParticipants = useSelector(getRemoteParticipants);
  /* @conditional-compile-remove(call-transfer) */
  const transferCall = useSelector(getTransferCall);

  // Reduce the controls shown when mobile view is enabled.
  const callControlOptions = props.mobileView
    ? reduceCallControlsForMobile(props.options?.callControls)
    : props.options?.callControls;

  /* @conditional-compile-remove(call-transfer) */
  // page subject is which should be participant shown in the transfer page depending on the transfer call state
  const pageSubject: TransferPageSubject = useMemo(() => {
    if (transferCall && ['Ringing', 'Connected'].includes(transferCall.state)) {
      return 'transferTarget';
    }
    return 'transferor';
  }, [transferCall]);

  const transferor = useMemo(
    () => (remoteParticipants ? Object.values(remoteParticipants)?.[0] : undefined),
    [remoteParticipants]
  );
  /* @conditional-compile-remove(call-transfer) */
  const transferTarget = useMemo(
    () => (transferCall?.remoteParticipants ? Object.values(transferCall.remoteParticipants)?.[0] : undefined),
    [transferCall]
  );
  let transferTileParticipant = transferor;
  /* @conditional-compile-remove(call-transfer) */
  if (pageSubject === 'transferTarget') {
    transferTileParticipant = transferTarget;
  }

  let transferParticipantDisplayName =
    transferor?.displayName ??
    /* @conditional-compile-remove(call-transfer) */ strings.transferPageUnknownTransferorDisplayName;
  /* @conditional-compile-remove(call-transfer) */
  if (pageSubject === 'transferTarget') {
    transferParticipantDisplayName =
      transferTarget?.displayName ?? strings.transferPageUnknownTransferTargetDisplayName;
  }

  return (
    <CallArrangement
      complianceBannerProps={{ strings }}
      // Ignore errors from before current call. This avoids old errors from showing up when a user re-joins a call.
      errorBarProps={props.options?.errorBar !== false && { ...errorBarProps, ignorePremountErrors: true }}
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
          /* @conditional-compile-remove(call-transfer) */
          statusText={
            pageSubject === 'transferTarget'
              ? strings.transferPageTransferTargetText
              : strings.transferPageTransferorText
          }
          onRenderAvatar={props.onRenderAvatar}
          onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
        />
      )}
      dataUiId={'transfer-page'}
      updateSidePaneRenderer={props.updateSidePaneRenderer}
      mobileChatTabHeader={props.mobileChatTabHeader}
    />
  );
};

interface TransferTileProps {
  /** React Child components. Child Components will show as overlay component in the VideoTile. */
  children?: React.ReactNode;
  /** User id for `onFetchAvatarPersonaData` callback to provide custom data to avatars rendered */
  userId?: string;
  /** Render component function to replace the default Persona Icon representing the transferor or transfer target. */
  onRenderAvatar?: OnRenderAvatarCallback;
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
  const { displayName, initialsName, userId, onRenderAvatar, onFetchAvatarPersonaData, statusText } = props;

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
    return personaSize ? <AvatarPersona {...placeholderOptions} dataProvider={onFetchAvatarPersonaData} /> : <></>;
  }, [placeholderOptions, onFetchAvatarPersonaData, personaSize]);

  const defaultAvatar = useMemo(() => defaultOnRenderAvatar(), [defaultOnRenderAvatar]);

  return (
    <div ref={tileRef} className={mergeStyles(tileContainerStyles)} data-is-focusable={true}>
      <Stack className={mergeStyles(tileContentStyles)} tokens={{ childrenGap: '1rem' }}>
        <Stack horizontalAlign="center" tokens={{ childrenGap: '0.5rem' }}>
          {onRenderAvatar ? onRenderAvatar(userId ?? '', placeholderOptions, defaultOnRenderAvatar) : defaultAvatar}
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
