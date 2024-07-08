// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IButtonStyles,
  IStackStyles,
  IconButton,
  Persona,
  PersonaSize,
  Stack,
  Text,
  Theme,
  useTheme
} from '@fluentui/react';
import React from 'react';
import { useLocale } from '../localization';

/**
 * Strings for the incoming call notification component.
 * @public
 */
export type IncomingCallNotificationStrings = {
  /**
   *Placeholder CallerID for the incoming call notification.
   */
  incomingCallNotificationPlaceholderId?: string;
  /**
   * Placeholder Alert for the incoming call notification.
   */
  incomingCallNotificationPlaceholderAlert?: string;
  /**
   * Aria label for the accept with audio button in the incoming call notification.
   */
  incomingCallNoticicationAcceptWithAudioAriaLabel?: string;
  /**
   * Aria label for the accept with video button in the incoming call notification.
   */
  incomingCallNoticicationAcceptWithVideoAriaLabel?: string;
  /**
   * Aria label for the reject button in the incoming call notification.
   */
  incomingCallNoticicationRejectAriaLabel?: string;
};

/**
 * Properties for the incoming call notification component.
 * @public
 */
export type IncomingCallNotificationProps = {
  /**
   * Caller's Name
   */
  callerName?: string;
  /**
   * Alert Text"
   */
  alertText?: string;
  /**
   * URL to the avatar image for the user
   */
  avatar?: string;
  /**
   * Callback to accept the call with audio
   */
  onAcceptWithAudio: () => void;
  /**
   * Callback to accept the call with Video
   */
  onAcceptWithVideo: () => void;
  /**
   * Callback to reject the call
   */
  onReject: () => void;
};

/**
 * A Notification component that is to be used to represent incoming calls to the end user.
 * Allows the user to accept or reject the incoming call.
 * @public
 */
export const IncomingCallNotification = (props: IncomingCallNotificationProps): JSX.Element => {
  const { callerName, alertText, avatar, onAcceptWithAudio, onAcceptWithVideo, onReject } = props;
  const theme = useTheme();
  const localeStrings = useLocale().strings.IncomingCallNotification;
  return (
    <Stack horizontal verticalAlign="center" styles={incomingCallToastStyle(theme)}>
      <Stack horizontalAlign="start" styles={incomingCallToastAvatarContainerStyle}>
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
          <Text>{callerName ?? localeStrings.incomingCallNotificationPlaceholderId}</Text>
        </Stack>
        <Stack style={{ fontSize: '0.75rem' }}>
          <Text>{alertText ?? localeStrings.incomingCallNotificationPlaceholderAlert}</Text>
        </Stack>
      </Stack>

      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <IconButton
          styles={incomingCallRejectButtonStyle(theme)}
          onClick={() => onReject()}
          iconProps={{ iconName: 'IncomingCallNotificationRejectIcon' }}
          ariaLabel={localeStrings.incomingCallNoticicationRejectAriaLabel}
        />
        <IconButton
          styles={incomingCallAcceptButtonStyle(theme)}
          onClick={() => onAcceptWithVideo()}
          iconProps={{ iconName: 'IncomingCallNotificationAcceptWithVideoIcon' }}
          ariaLabel={localeStrings.incomingCallNoticicationAcceptWithVideoAriaLabel}
        />
        <IconButton
          styles={incomingCallAcceptButtonStyle(theme)}
          onClick={() => onAcceptWithAudio()}
          iconProps={{ iconName: 'IncomingCallNotificationAcceptIcon' }}
          ariaLabel={localeStrings.incomingCallNoticicationAcceptWithAudioAriaLabel}
        />
      </Stack>
    </Stack>
  );
};

const incomingCallToastStyle = (theme: Theme): IStackStyles => {
  return {
    root: {
      minWidth: '20rem',
      width: '100%',
      height: '100%',
      opacity: 0.95,
      borderRadius: '0.5rem',
      boxShadow: theme.effects.elevation8,
      padding: '1rem'
    }
  };
};

const incomingCallToastAvatarContainerStyle: IStackStyles = {
  root: {
    marginRight: '0.5rem'
  }
};

const incomingCallAcceptButtonStyle = (theme: Theme): IButtonStyles => {
  return {
    root: {
      backgroundColor: theme.palette.greenDark,
      color: theme.palette.white,
      borderRadius: '2rem',
      minWidth: '2rem',
      width: '2rem',
      border: 'none',
      ':hover, :active': {
        backgroundColor: theme.palette.green,
        color: theme.palette.white
      }
    }
  };
};

const incomingCallRejectButtonStyle = (theme: Theme): IButtonStyles => {
  return {
    root: {
      backgroundColor: theme.palette.redDark,
      color: theme.palette.white,
      borderRadius: '2rem',
      minWidth: '2rem',
      width: '2rem',
      border: 'none',
      ':hover, :active': {
        backgroundColor: theme.palette.red,
        color: theme.palette.white
      }
    }
  };
};
