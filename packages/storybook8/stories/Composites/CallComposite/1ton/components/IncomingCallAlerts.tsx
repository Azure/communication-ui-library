// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  DefaultButton,
  Persona,
  PersonaSize,
  Stack,
  getTheme,
  IDialogFooterStyles,
  mergeStyles
} from '@fluentui/react';
import { Call20Filled, CallEnd20Filled } from '@fluentui/react-icons';
import React from 'react';

const theme = getTheme();
const palette = theme.palette;

export const incomingCallToastStyle = mergeStyles({
  minWidth: '20rem',
  width: '100%',
  height: '100%',
  backgroundColor: palette.whiteTranslucent40,
  opacity: 0.95,
  borderRadius: '0.5rem',
  boxShadow: theme.effects.elevation8,
  padding: '1rem'
});

export const incomingCallToastAvatarContainerStyle = mergeStyles({
  marginRight: '0.5rem'
});

export const incomingCallAcceptButtonStyle = mergeStyles({
  backgroundColor: palette.greenDark,
  color: palette.white,
  borderRadius: '2rem',
  minWidth: '2rem',
  width: '2rem',
  border: 'none',
  padding: 'none',
  ':hover, :active': {
    backgroundColor: palette.green,
    color: palette.white
  }
});

export const incomingCallRejectButtonStyle = mergeStyles({
  backgroundColor: palette.redDark,
  color: palette.white,
  borderRadius: '2rem',
  minWidth: '2rem',
  width: '2rem',
  border: 'none',
  padding: 'none',
  ':hover, :active': {
    backgroundColor: palette.red,
    color: palette.white
  }
});

export const incomingCallModalContainerStyle = {
  borderRadius: '0.75rem'
};

export const incomingCallModalLocalPreviewStyle = mergeStyles({
  height: '10rem',
  background: palette.neutralLighterAlt,
  margin: '1.5rem 0',
  borderRadius: '0.25rem',
  '& video': {
    borderRadius: '0.25rem'
  }
});

export const incomingCallModalDialogFooterStyle: IDialogFooterStyles = {
  action: {},
  actions: {},
  actionsRight: {
    display: 'flex'
  }
};

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
          showOverflowTooltip={false}
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
          onRenderIcon={() => <CallEnd20Filled style={{ display: 'flex' }} />}
        />
        <DefaultButton
          className={incomingCallAcceptButtonStyle}
          onClick={() => onClickAccept()}
          onRenderIcon={() => <Call20Filled style={{ display: 'flex' }} />}
        />
      </Stack>
    </Stack>
  );
};
