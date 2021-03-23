// © Microsoft Corporation. All rights reserved.

import React from 'react';

import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { IncomingCallToast } from '../../composites/OneToOneCall/IncomingCallAlerts';
import { FluentThemeProvider } from '../../providers';
import { Stack } from '@fluentui/react';

const IncomingCallToastExample: () => JSX.Element = () => {
  const defaultIncomingCall = {
    callerName: 'Maximus Aurelius',
    alertText: 'You are being summoned...',
    avatar: undefined,
    onClickAccept: () => null,
    onClickReject: () => null
  };

  return (
    <FluentThemeProvider>
      <Stack style={{ width: '320px' }}>
        <IncomingCallToast {...defaultIncomingCall} />
      </Stack>
    </FluentThemeProvider>
  );
};

const exampleCode = `
import { DefaultButton, Persona, PersonaSize, Stack, Dialog, DialogType, DialogFooter } from '@fluentui/react';
import { CallEndIcon, CallIcon, CallVideoIcon, CallVideoOffIcon } from '@fluentui/react-northstar';
import { getTheme, mergeStyles } from '@fluentui/react';
const theme = getTheme();
const palette = theme.palette;

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
  /** Alert Text. For example "incoming vido call..." */
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
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Incoming Call Alerts</Title>
      <Description>
        The Incoming Call Alert Components alert about an incoming call. They can render a local video preview, custom
        avatar image, caller name and incoming call alert text. It also supports custom actions for the call end and
        receive buttons. By default, the call end and receive buttons do not have an effect. User will need to provide
        the `onClickAccept` and `onClickReject` functions that handle the call.
      </Description>
      <Heading>Incoming Call Toast</Heading>
      <Canvas>
        <IncomingCallToastExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Incoming Call Modal</Heading>
    </>
  );
};
