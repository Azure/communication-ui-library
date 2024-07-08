// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  DefaultButton,
  Persona,
  PersonaSize,
  Stack,
  Dialog,
  DialogType,
  DialogFooter,
  useTheme
} from '@fluentui/react';
import { CallEnd20Filled, Call20Filled } from '@fluentui/react-icons';
import { mergeStyles } from '@fluentui/react';
import React from 'react';

export type IncomingCallNotificationProps = {
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

export const IncomingCallNotification = (props: IncomingCallNotificationProps): JSX.Element => {
  const { callerName, alertText, avatar, onClickAccept, onClickReject } = props;
  const theme = useTheme();
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

const incomingCallToastStyle = mergeStyles({
  minWidth: '20rem',
  width: '100%',
  height: '100%',
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
