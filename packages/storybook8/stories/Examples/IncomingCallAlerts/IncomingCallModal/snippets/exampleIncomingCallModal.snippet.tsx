import { StreamMedia, VideoTile } from '@azure/communication-react';
import { DefaultButton, Persona, PersonaSize, Stack, Dialog, DialogType, DialogFooter } from '@fluentui/react';
import { VideoOff20Regular, Video20Regular } from '@fluentui/react-icons';
import { DefaultPalette, mergeStyles } from '@fluentui/react';
import React from 'react';
import { useBoolean } from '@fluentui/react-hooks';

const palette = DefaultPalette;

const incomingCallModalContainerStyle = {
  borderRadius: '0.75rem'
};

const incomingCallModalLocalPreviewStyle = mergeStyles({
  height: '10rem',
  background: palette.neutralLighterAlt,
  margin: '1.5rem 0',
  borderRadius: '0.25rem',
  '& video': {
    borderRadius: '0.25rem'
  }
});

interface IncomingCallModalProps {
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
  /** Text to the right of a Caller's Name */
  callerNameAlt?: string;
  /** A Caller's subtitle. Displayed right below the callers name */
  callerTitle?: string;
  /** Receiver's Name */
  localParticipantDisplayName?: string;
  /** If set to 'true', mirrors the local video preview of the receiver */
  localVideoInverted?: boolean;
  /** Local Video Stream Element. An HTML Element containing a video stream. */
  localVideoStreamElement: HTMLElement | null;
  /** Provide a function that handles the call behavior when Video Toggle Button is clicked */
  onClickVideoToggle: () => void;
}

const IncomingCallModalStory = (props: IncomingCallModalProps): JSX.Element => {
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
  const palette = DefaultPalette;
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false);
  const dialogContentProps = { type: DialogType.normal, title: alertText ?? 'Incoming Video Call' };

  const mediaGalleryLocalParticipant: JSX.Element = (
    <VideoTile
      renderElement={<StreamMedia videoStreamElement={localVideoStreamElement} />}
      displayName={localParticipantDisplayName}
      isMirrored={localVideoInverted}
    />
  );

  const showLocalVideo = !!localVideoStreamElement;

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
            onRenderIcon={() => (showLocalVideo ? <Video20Regular /> : <VideoOff20Regular />)}
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

export const IncomingCallModal = IncomingCallModalStory.bind({});
