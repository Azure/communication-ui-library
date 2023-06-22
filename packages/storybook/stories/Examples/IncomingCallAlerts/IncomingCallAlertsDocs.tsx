// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Description, Heading, Source, Title } from '@storybook/addon-docs';
import React from 'react';

const exampleIncomingCallToast = `
import { DefaultButton, Persona, PersonaSize, Stack, Dialog, DialogType, DialogFooter } from '@fluentui/react';
import { CallEnd20Filled, Call20Filled } from '@fluentui/react-icons';
import { DefaultPalette, mergeStyles } from '@fluentui/react';

const palette = DefaultPalette;

const incomingCallToastStyle = mergeStyles({
  minWidth: '20rem',
  width: '100%',
  height: '100%',
  backgroundColor: palette.whiteTranslucent40,
  opacity: 0.95,
  borderRadius: '0.5rem',
  boxShadow: theme.effects.elevation8,
  padding: '1rem'
});

const incomingCallToastAvatarContainerStyle = mergeStyles({
  marginRight: '0.5rem'
});

const incomingCallAcceptButtonStyle = mergeStyles({
  backgroundColor: palette.greenDark,
  color: palette.white,
  borderRadius: '2rem',
  minWidth: '2rem',
  width: '2rem',
  border: 'none',
  ':hover, :active': {
    backgroundColor: palette.green,
    color: palette.white
  }
});

const incomingCallRejectButtonStyle = mergeStyles({
  backgroundColor: palette.redDark,
  color: palette.white,
  borderRadius: '2rem',
  minWidth: '2rem',
  width: '2rem',
  border: 'none',
  ':hover, :active': {
    backgroundColor: palette.red,
    color: palette.white
  }
});

type IncomingCallToastProps = {
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

const IncomingCallToast = (props: IncomingCallToastProps): JSX.Element => {
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
`;

const exampleIncomingCallModal = `
import { StreamMedia, VideoTile } from '@azure/communication-react';
import { DefaultButton, Persona, PersonaSize, Stack, Dialog, DialogType, DialogFooter } from '@fluentui/react';
import { CallEndIcon, CallIcon, CallVideoIcon, CallVideoOffIcon } from '@fluentui/react-northstar';
import { DefaultPalette, mergeStyles } from '@fluentui/react';

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

interface IncomingCallModalProps extends IncomingCallToastProps {
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

const IncomingCallModal = (props: IncomingCallModalProps): JSX.Element => {
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

  cosnt showLocalVideo = !!localVideoStreamElement;

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
            onRenderIcon={() => (showLocalVideo ? <CallVideoIcon size="small" /> : <CallVideoOffIcon size="small" />)}
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
`;

export const getModalDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Incoming Call Alerts</Title>
      <Description>
        The Incoming Call Alert Components alert about an incoming call. They can render a local video preview, custom
        avatar image, caller name and incoming call alert text.
      </Description>
      <Heading>Incoming Call Modal</Heading>
      <Source code={exampleIncomingCallModal} />
    </>
  );
};

export const getToastDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Incoming Call Toast</Title>
      <Source code={exampleIncomingCallToast} />
    </>
  );
};
