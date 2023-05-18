// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  IPersonaStyles,
  IStyleFunctionOrObject,
  IPersonaStyleProps,
  IStyle,
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
/* @conditional-compile-remove(call-transfer) */
import { CallState } from '@internal/calling-stateful-client';
import { getTransferCall } from '../selectors/baseSelectors';
import { reduceCallControlsForMobile } from '../utils';
import { LobbyPageProps } from './LobbyPage';
import { AvatarPersona, AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';

type TransferPageState = 'transferring' | 'connecting';

export const TransferPage = (
  props: LobbyPageProps & {
    onRenderAvatar?: OnRenderAvatarCallback;
    onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  }
): JSX.Element => {
  const errorBarProps = usePropsFor(ErrorBar);
  const strings = useLocale().strings.call;
  const remoteParticipants = useSelector(getRemoteParticipants);
  let transferCall: CallState | undefined;
  /* @conditional-compile-remove(call-transfer) */
  transferCall = useSelector(getTransferCall);

  // Reduce the controls shown when mobile view is enabled.
  let callControlOptions = props.mobileView
    ? reduceCallControlsForMobile(props.options?.callControls)
    : props.options?.callControls;

  const transferor = remoteParticipants ? Object.values(remoteParticipants)[0] : undefined;

  const pageState: TransferPageState = useMemo(() => {
    if (transferCall !== undefined) {
      if (['Ringing', 'Connected'].includes(transferCall.state)) {
        return 'connecting';
      } else {
        return 'transferring';
      }
    }
    return 'transferring';
  }, [transferCall, transferCall?.state]);

  const transferTileParticipant = pageState === 'transferring' ? transferor : transferCall?.remoteParticipants[0];

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
          displayName={transferTileParticipant?.displayName}
          initialsName={transferTileParticipant?.displayName}
          statusText={
            pageState === 'connecting' ? strings.transferPageConnectingText : strings.transferPageConnectingText
          }
          onRenderPlaceholder={props.onRenderAvatar}
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
  /** Custom render Component function for no video is available. Render a Persona Icon if undefined. */
  onRenderPlaceholder?: OnRenderAvatarCallback;
  /** A callback function that can be used to provide custom data to avatars rendered */
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  /**
   * Display Name of the Participant to be shown in the label.
   * @remarks `displayName` is used to generate avatar initials if `initialsName` is not provided.
   */
  displayName?: string;
  /**
   * Name of the participant used to generate initials for the avatar. For example, a name `John Doe` will display `JD`
   * as initials.
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
    onRenderPlaceholder,
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
    [userId, initialsName, displayName, personaSize, defaultPersonaStyles]
  );

  const onRenderAvatar = useCallback(() => {
    return personaSize ? <AvatarPersona {...placeholderOptions} dataProvider={onFetchAvatarPersonaData} /> : <></>;
  }, [userId, placeholderOptions, onFetchAvatarPersonaData, personaSize]);

  const defaultAvatar = useMemo(() => onRenderAvatar(), [onRenderAvatar]);

  return (
    <div ref={tileRef} className={mergeStyles(videoContainerStyles)} data-is-focusable={true}>
      <Stack className={mergeStyles(tileContentStyles)} tokens={{ childrenGap: '1rem' }}>
        <Stack horizontalAlign="center" tokens={{ childrenGap: '0.5rem' }}>
          {onRenderPlaceholder ? onRenderPlaceholder(userId ?? '', placeholderOptions, onRenderAvatar) : defaultAvatar}
          <Text className={mergeStyles({ textAlign: 'center', fontSize: '1.5rem', fontWeight: 400 })}>
            {displayName ?? 'Unknown'}
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
