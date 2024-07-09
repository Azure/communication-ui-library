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
/* @conditional-compile-remove(one-to-n-calling) */
import { useLocale } from '../localization';

/**
 * Strings for the incoming call notification component.
 *
 * @beta
 */
export interface IncomingCallNotificationStrings {
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
}

/**
 * Styles for the incoming call notification component.
 *
 * @beta
 */
export interface IncomingCallNotificationStyles {
  /**
   * Styles for the accept buttons.
   */
  acceptButton?: IButtonStyles;
  /**
   * Styles for the reject button.
   */
  rejectButton?: IButtonStyles;
  /**
   * Styles for the root container.
   */
  root?: IStackStyles;
  /**
   * Styles for the avatar container.
   */
  avatarContainer?: IStackStyles;
}

/**
 * Properties for the incoming call notification component.
 *
 * @beta
 */
export interface IncomingCallNotificationProps {
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
  avatarImage?: string;
  /**
   * Size of the persona coin
   */
  personaSize?: number;
  /**
   * Callback to render the avatar
   */
  onRenderAvatar?: () => JSX.Element;
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
  /**
   * Styles for the incoming call notification component.
   */
  styles?: IncomingCallNotificationStyles;
}

/**
 * A Notification component that is to be used to represent incoming calls to the end user.
 * Allows the user to accept or reject the incoming call.
 * @beta
 */
export const IncomingCallNotification = (props: IncomingCallNotificationProps): JSX.Element => {
  const { callerName, alertText, avatarImage, onAcceptWithAudio, onAcceptWithVideo, onReject, personaSize, styles } =
    props;
  const theme = useTheme();
  /* @conditional-compile-remove(one-to-n-calling) */
  const localeStrings = useLocale().strings.IncomingCallNotification;
  return (
    <Stack
      horizontal
      tokens={{ childrenGap: '0.5rem' }}
      verticalAlign="center"
      styles={styles?.root ? styles.root : incomingCallToastStyle(theme)}
    >
      <Stack
        horizontalAlign="start"
        styles={styles?.avatarContainer ? styles.avatarContainer : incomingCallToastAvatarContainerStyle}
      >
        <Persona
          imageUrl={avatarImage}
          text={callerName}
          size={PersonaSize.size40}
          coinSize={personaSize}
          hidePersonaDetails={true}
          aria-label={callerName}
        />
      </Stack>

      <Stack grow={1} horizontalAlign="center" style={{ alignItems: 'flex-start', fontFamily: 'Segoe UI' }}>
        <Stack style={{ fontSize: '0.875rem' }}>
          <Text>
            {callerName ??
              /* @conditional-compile-remove(one-to-n-calling) */ localeStrings.incomingCallNotificationPlaceholderId}
          </Text>
        </Stack>
        <Stack style={{ fontSize: '0.75rem' }}>
          <Text>
            {alertText ??
              /* @conditional-compile-remove(one-to-n-calling) */ localeStrings.incomingCallNotificationPlaceholderAlert}
          </Text>
        </Stack>
      </Stack>

      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <IconButton
          styles={styles?.rejectButton ? styles.rejectButton : incomingCallRejectButtonStyle(theme)}
          onClick={() => onReject()}
          iconProps={{ iconName: 'IncomingCallNotificationRejectIcon' }}
          /* @conditional-compile-remove(one-to-n-calling) */
          ariaLabel={localeStrings.incomingCallNoticicationRejectAriaLabel}
        />
        <IconButton
          styles={styles?.acceptButton ? styles.acceptButton : incomingCallAcceptButtonStyle(theme)}
          onClick={() => onAcceptWithVideo()}
          iconProps={{ iconName: 'IncomingCallNotificationAcceptWithVideoIcon' }}
          /* @conditional-compile-remove(one-to-n-calling) */
          ariaLabel={localeStrings.incomingCallNoticicationAcceptWithVideoAriaLabel}
        />
        <IconButton
          styles={styles?.acceptButton ? styles.acceptButton : incomingCallAcceptButtonStyle(theme)}
          onClick={() => onAcceptWithAudio()}
          iconProps={{ iconName: 'IncomingCallNotificationAcceptIcon' }}
          /* @conditional-compile-remove(one-to-n-calling) */
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
      maxWidth: '40rem',
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
      border: 'none'
    },
    rootHovered: {
      backgroundColor: theme.palette.green,
      color: theme.palette.white
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
      border: 'none'
    },
    rootHovered: {
      backgroundColor: theme.palette.red,
      color: theme.palette.white
    }
  };
};
