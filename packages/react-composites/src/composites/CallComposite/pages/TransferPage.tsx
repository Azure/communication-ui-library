// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  IPersonaStyleProps,
  IPersonaStyles,
  IStyle,
  IStyleFunctionOrObject,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  mergeStyles
} from '@fluentui/react';
import { ErrorBar, OnRenderAvatarCallback } from '@internal/react-components';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from '../../localization';
import { CallArrangement } from '../components/CallArrangement';
import { usePropsFor } from '../hooks/usePropsFor';
import { useSelector } from '../hooks/useSelector';
import { getRemoteParticipants } from '../selectors/baseSelectors';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { AvatarPersona, AvatarPersonaDataCallback } from '../../common/AvatarPersona';
/* @conditional-compile-remove(call-transfer) */
import { getTransferCall } from '../selectors/baseSelectors';
import { reduceCallControlsForMobile } from '../utils';
import { LobbyPageProps } from './LobbyPage';

/* @conditional-compile-remove(call-transfer) */
type TransferPageState = 'transferring' | 'connecting';

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
  const pageState: TransferPageState = useMemo(() => {
    if (transferCall !== undefined) {
      if (['Ringing', 'Connected'].includes(transferCall.state)) {
        return 'connecting';
      } else {
        // If transfer call's state is connecting we want this page's state to be transferring
        return 'transferring';
      }
    }
    return 'transferring';
  }, [transferCall]);

  const transferor = remoteParticipants ? Object.values(remoteParticipants)[0] : undefined;
  /* @conditional-compile-remove(call-transfer) */
  const transferTarget = transferCall?.remoteParticipants[0];
  let transferParticipant = transferor;
  /* @conditional-compile-remove(call-transfer) */
  if (pageState === 'connecting') {
    transferParticipant = transferTarget;
  }

  let transferParticipantDisplayName =
    transferor?.displayName ??
    /* @conditional-compile-remove(call-transfer) */ strings.transferPageUnknownTransferorDisplayName;
  /* @conditional-compile-remove(call-transfer) */
  if (pageState === 'connecting') {
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
          userId={transferParticipant ? toFlatCommunicationIdentifier(transferParticipant?.identifier) : undefined}
          displayName={transferParticipantDisplayName}
          initialsName={transferParticipantDisplayName}
          /* @conditional-compile-remove(call-transfer) */
          statusText={
            pageState === 'connecting' ? strings.transferPageConnectingText : strings.transferPageTransferringText
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
  const {
    displayName,
    initialsName,
    userId,
    onRenderAvatar,
    onFetchAvatarPersonaData,
    statusText: statusString
  } = props;

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
    <div ref={tileRef} className={mergeStyles(videoContainerStyles)} data-is-focusable={true}>
      <Stack className={mergeStyles(tileContentStyles)} tokens={{ childrenGap: '1rem' }}>
        <Stack horizontalAlign="center" tokens={{ childrenGap: '0.5rem' }}>
          {onRenderAvatar ? onRenderAvatar(userId ?? '', placeholderOptions, defaultOnRenderAvatar) : defaultAvatar}
          <Text className={mergeStyles({ textAlign: 'center', fontSize: '1.5rem', fontWeight: 400 })}>
            {displayName}
          </Text>
        </Stack>
        <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={{ childrenGap: '0.5rem' }}>
          <Spinner size={SpinnerSize.large} styles={{ circle: { borderWidth: '0.125rem' } }} />
          <Text className={mergeStyles({ textAlign: 'center', fontSize: '1rem' })}>{statusString}</Text>
        </Stack>
      </Stack>
    </div>
  );
};

const videoContainerStyles: IStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  minWidth: '100%',
  minHeight: '100%',
  objectPosition: 'center',
  objectFit: 'cover',
  zIndex: 0
};

const tileContentStyles: IStyle = {
  width: '100%',
  position: 'absolute',
  top: '50%',
  transform: 'translate(0, -50%)',
  display: 'flex',
  justifyContent: 'center'
};

const defaultPersonaStyles: IStyleFunctionOrObject<IPersonaStyleProps, IPersonaStyles> = { root: { margin: 'auto' } };
