// © Microsoft Corporation. All rights reserved.
import {
  DefaultButton,
  getTheme,
  Persona,
  PersonaSize,
  Stack,
  Dialog,
  DialogType,
  PrimaryButton,
  DialogFooter
} from '@fluentui/react';
import { CallEndIcon, CallIcon, CallVideoIcon, CallVideoOffIcon } from '@fluentui/react-northstar';
import React from 'react';
import {
  incomingCallAcceptButtonStyle,
  incomingCallRejectButtonStyle,
  incomingCallToastAvatarContainerStyle,
  incomingCallToastStyle,
  incomingCallModalLocalPreviewStyle,
  incomingCallModalContainerStyle
} from './styles/IncomingCallAlerts.styles';
import { useBoolean } from '@uifabric/react-hooks';
import { MediaGalleryTileComponent as MediaGalleryTile, MediaGalleryTileProps } from '../components/MediaGalleryTile';
import {
  connectFuncsToContext,
  LocalVideoContainerOwnProps,
  VideoContainerProps,
  MapToLocalVideoProps
} from '../consumers';
import { LocalVideoStream, ScalingMode } from '@azure/communication-calling';

export type IncomingCallToastProps = {
  /** Caller's Name */
  callerName?: string;
  /** Alert Text. For example "incoming vido call..." */
  alertText?: string;
  /** Caller's Avatar/Profile Image */
  avatar?: string;
  /** Provide a function that handles the call behavior when Accept Button is clicked */
  onClickAccept: () => void;
  /** Provide a function that handles the call behavior when Reject Button is clicked */
  onClickReject: () => void;
};

export const IncomingCallToast = (props: IncomingCallToastProps): JSX.Element => {
  const theme = getTheme();
  const palette = theme.palette;
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
        <Stack style={{ fontSize: '0.875rem', color: palette.black }}>
          <b>{callerName ?? 'No display name'}</b>
        </Stack>
        <Stack style={{ fontSize: '0.75rem', color: palette.black }}>
          <span>{alertText ?? 'Incoming call'}</span>
        </Stack>
      </Stack>

      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <DefaultButton onClick={() => onClickReject()} className={incomingCallRejectButtonStyle}>
          <CallEndIcon size={'medium'} />
        </DefaultButton>
        <DefaultButton onClick={() => onClickAccept()} className={incomingCallAcceptButtonStyle}>
          <CallIcon size={'medium'} />
        </DefaultButton>
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
  localParticipantName?: string;
  /** Receiver's local video scaling mode */
  localVideoScalingMode?: ScalingMode;
  /** If set to `true`, mirrors the local video preview of the receiver */
  localVideoInverted?: boolean;
  /** Toggle local video preview on or off */
  showLocalVideo?: boolean;
  /** Local Video Stream */
  localVideoStream: LocalVideoStream | undefined;
  /** Optional callback to render local media gallery tile. */
  onRenderLocalMediaGalleryTile?: (props: MediaGalleryTileProps) => JSX.Element;
  /** Optional connection function to map the ACS stream data to the local media gallery tile. This is only needed
   * if MapLocalVideoContextToProps from ACS data layer is not suited for you.
   */
  connectLocalMediaGalleryTileWithData?: (ownProps: LocalVideoContainerOwnProps) => VideoContainerProps;
  noLocalVideoAvailableAriaLabel?: string;
  /** Provide a function that handles the call behavior when Video Toggle Button is clicked */
  onClickVideoToggle: () => void;
}

export const IncomingCallModal = (props: IncomingCallModalProps): JSX.Element => {
  const theme = getTheme();
  const palette = theme.palette;
  const {
    alertText,
    avatar,
    callerName,
    callerNameAlt,
    callerTitle,
    connectLocalMediaGalleryTileWithData,
    localParticipantName,
    localVideoInverted,
    localVideoScalingMode,
    noLocalVideoAvailableAriaLabel,
    onClickAccept,
    onClickReject,
    onClickVideoToggle,
    onRenderLocalMediaGalleryTile,
    showLocalVideo,
    localVideoStream
  } = props;
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false);
  const dialogContentProps = { type: DialogType.normal, title: alertText ?? 'Incoming Video Call' };

  const mediaGalleryLocalParticipant: JSX.Element = connectFuncsToContext(
    onRenderLocalMediaGalleryTile ?? MediaGalleryTile,
    connectLocalMediaGalleryTileWithData ?? MapToLocalVideoProps
  )({
    label: undefined,
    avatarName: localParticipantName,
    stream: localVideoStream,
    scalingMode: localVideoScalingMode,
    noVideoAvailableAriaLabel: noLocalVideoAvailableAriaLabel,
    invertVideo: localVideoInverted
  });

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
            onClick={() => onClickVideoToggle()}
            style={{ background: palette.neutralLighterAlt, border: 'none' }}
          >
            {showLocalVideo ? <CallVideoIcon size="small" /> : <CallVideoOffIcon size="small" />}
          </DefaultButton>

          <PrimaryButton onClick={() => onClickAccept()} style={{ background: palette.green, border: 'none' }}>
            <span style={{ fontFamily: 'Segoe UI Semibold' }}>Accept</span>
          </PrimaryButton>

          <DefaultButton
            onClick={() => onClickReject()}
            text="Decline"
            style={{ background: palette.redDark, color: palette.white, border: 'none' }}
          />
        </DialogFooter>
      </Dialog>
    </>
  );
};
