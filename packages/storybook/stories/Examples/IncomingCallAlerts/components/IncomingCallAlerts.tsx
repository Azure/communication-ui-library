// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StreamMedia, VideoTile, useTheme } from '@azure/communication-react';
import { DefaultButton, Persona, PersonaSize, Stack, Dialog, DialogType, DialogFooter } from '@fluentui/react';
import { Call20Filled, CallEnd20Filled, Video20Filled, VideoOff20Filled } from '@fluentui/react-icons';
import { useBoolean } from '@uifabric/react-hooks';
import React from 'react';
import {
  incomingCallAcceptButtonStyle,
  incomingCallRejectButtonStyle,
  incomingCallToastAvatarContainerStyle,
  incomingCallToastStyle,
  incomingCallModalLocalPreviewStyle,
  incomingCallModalContainerStyle
} from './styles/IncomingCallAlerts.styles';

export type IncomingCallToastProps = {
  /** Caller's Name */
  callerName?: string;
  /** Alert Text. For example "incoming video call..." */
  alertText?: string;
  /** Caller's Avatar/Profile Image */
  avatar?: string;
  /** Provide a function that handles the call behavior when Accept Button is clicked */
  onClickAccept: () => void;
  /** Provide a function that handles the call behavior when Reject Button is clicked */
  onClickReject: () => void;
};

export const IncomingCallToast = (props: IncomingCallToastProps): JSX.Element => {
  const { callerName, alertText, avatar, onClickAccept, onClickReject } = props;

  return (
    <Stack horizontal verticalAlign="center" className={incomingCallToastStyle}>
      <Stack horizontalAlign="start" className={incomingCallToastAvatarContainerStyle}>
        <Persona
          imageUrl={avatar}
          text={callerName}
          size={PersonaSize.size40}
          hidePersonaDetails={true}
          aria-label={callerName}
        />
      </Stack>

      <Stack grow={1} horizontalAlign="center" style={{ alignItems: 'flex-start', fontFamily: 'Segoe UI' }}>
        <Stack style={{ fontSize: '0.875rem' }}>
          <b>{callerName ?? 'No display name'}</b>
        </Stack>
        <Stack style={{ fontSize: '0.75rem' }}>
          <span>{alertText ?? 'Incoming call'}</span>
        </Stack>
      </Stack>

      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <DefaultButton
          className={incomingCallRejectButtonStyle}
          onClick={() => onClickReject()}
          onRenderIcon={() => <CallEnd20Filled />}
        />
        <DefaultButton
          className={incomingCallAcceptButtonStyle}
          onClick={() => onClickAccept()}
          onRenderIcon={() => <Call20Filled />}
        />
      </Stack>
    </Stack>
  );
};

export interface IncomingCallModalProps extends IncomingCallToastProps {
  /** Text to the right of a Caller's Name */
  callerNameAlt?: string;
  /** A Caller's subtitle. Displayed right below the callers name */
  callerTitle?: string;
  /** Receiver's Name */
  localParticipantDisplayName?: string;
  /** If set to `true`, mirrors the local video preview of the receiver */
  localVideoInverted?: boolean;
  /** Local Video Stream Element. An HTML Element containing a video stream. */
  localVideoStreamElement: HTMLElement | null;
  /** Provide a function that handles the call behavior when Video Toggle Button is clicked */
  onClickVideoToggle: () => void;
}

export const IncomingCallModal = (props: IncomingCallModalProps): JSX.Element => {
  const {
    alertText,
    avatar,
    callerName,
    callerNameAlt,
    callerTitle,
    localParticipantDisplayName,
    localVideoInverted,
    onClickAccept,
    onClickReject,
    onClickVideoToggle,
    localVideoStreamElement
  } = props;
  const theme = useTheme();
  const palette = theme.palette;
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false);
  const dialogContentProps = { type: DialogType.normal, title: alertText ?? 'Incoming Video Call' };
  const showLocalVideo = !!localVideoStreamElement;

  const mediaGalleryLocalParticipant: JSX.Element = (
    <VideoTile
      renderElement={<StreamMedia videoStreamElement={localVideoStreamElement} />}
      displayName={localParticipantDisplayName}
      isMirrored={localVideoInverted}
    />
  );

  return (
    <>
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={{
          isBlocking: true,
          styles: { main: incomingCallModalContainerStyle }
        }}
      >
        <Stack horizontal verticalAlign="center">
          <Stack horizontalAlign="start" style={{ marginRight: '0.5rem' }}>
            <Persona
              imageUrl={avatar}
              text={callerName}
              size={PersonaSize.size40}
              hidePersonaDetails={true}
              aria-label={callerName}
            />
          </Stack>
          <Stack grow={1} horizontalAlign="center" style={{ alignItems: 'flex-start' }}>
            <Stack style={{ fontSize: '0.875rem', color: palette.black, fontWeight: 'bold' }}>
              <span>
                {callerName ?? 'No display name'}
                {callerNameAlt ? (
                  <span style={{ opacity: 0.5, marginLeft: '0.2rem' }}> &bull; {callerNameAlt}</span>
                ) : null}
              </span>
            </Stack>
            <Stack style={{ fontSize: '0.75rem', color: palette.neutralDark }}>
              <span>{callerTitle ?? ''}</span>
            </Stack>
          </Stack>
        </Stack>

        {showLocalVideo ? (
          <Stack className={incomingCallModalLocalPreviewStyle}>{mediaGalleryLocalParticipant}</Stack>
        ) : null}

        <DialogFooter>
          <DefaultButton
            style={{ background: palette.neutralLighterAlt, border: 'none' }}
            onClick={() => onClickVideoToggle()}
            onRenderIcon={() =>
              showLocalVideo ? (
                <Video20Filled primaryFill="currentColor" />
              ) : (
                <VideoOff20Filled primaryFill="currentColor" />
              )
            }
          />

          <DefaultButton
            onClick={() => onClickAccept()}
            text="Accept"
            style={{ background: palette.green, border: 'none' }}
          />

          <DefaultButton
            onClick={() => onClickReject()}
            text="Decline"
            style={{ background: palette.redDark, border: 'none' }}
          />
        </DialogFooter>
      </Dialog>
    </>
  );
};
