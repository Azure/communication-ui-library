// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  DefaultButton,
  IButtonStyles,
  IconButton,
  IStackStyles,
  Persona,
  PersonaSize,
  PrimaryButton,
  Stack,
  Text,
  Theme,
  useTheme
} from '@fluentui/react';
import React from 'react';
/* @conditional-compile-remove(one-to-n-calling) */
import { useLocale } from '../localization';
import { _formatString } from '@internal/acs-ui-common';

/**
 * Strings for the incoming call notification component.
 *
 * @beta
 */
export interface IncomingCallNotificationStrings {
  /**
   * Placeholder CallerID for the incoming call notification.
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
  /**
   * Label for the accept button in the incoming call notification.
   */
  incomingCallNotificationAcceptButtonLabel?: string;
  /**
   * Label for the accept with video button in the incoming call notification.
   */
  incomingCallNotificationAccceptWithVideoButtonLabel?: string;
  /**
   * label for the reject button in the incoming call notification.
   */
  incomingCallNotificationRejectButtonLabel?: string;
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
   * Callback when the notification is dismissed
   */
  onDismiss?: () => void;
  /**
   * Styles for the incoming call notification component.
   */
  styles?: IncomingCallNotificationStyles;
  /**
   * Strings for the incoming call notification component.
   */
  strings?: IncomingCallNotificationStrings;
}

/**
 * A Notification component that is to be used to represent incoming calls to the end user.
 * Allows the user to accept or reject the incoming call.
 * @beta
 */
export const IncomingCallNotification = (props: IncomingCallNotificationProps): JSX.Element => {
  const {
    callerName,
    alertText,
    avatarImage,
    onAcceptWithAudio,
    onAcceptWithVideo,
    onReject,
    onDismiss,
    personaSize,
    styles,
    strings
  } = props;
  const theme = useTheme();
  /* @conditional-compile-remove(one-to-n-calling) */
  const localeStrings = useLocale().strings.IncomingCallNotification;
  /* @conditional-compile-remove(one-to-n-calling) */
  const formattedMessageString =
    localeStrings.incomingCallNotificationPlaceholderAlert && callerName
      ? _formatString(localeStrings.incomingCallNotificationPlaceholderAlert, { callerName: callerName })
      : callerName;
  return (
    <Stack
      tokens={{ childrenGap: '0.5rem' }}
      verticalAlign="center"
      styles={styles?.root ? styles.root : incomingCallToastStyle(theme)}
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: personaSize ? '0.5rem' : '0rem' }}>
        <Stack
          horizontalAlign="start"
          styles={styles?.avatarContainer ? styles.avatarContainer : incomingCallToastAvatarContainerStyle}
        >
          <Persona
            imageUrl={avatarImage}
            text={callerName}
            size={PersonaSize.size24}
            coinSize={personaSize}
            hidePersonaDetails={true}
            aria-label={callerName}
          />
        </Stack>

        <Stack grow={1} horizontalAlign="center" style={{ alignItems: 'flex-start', fontFamily: 'Segoe UI' }}>
          <Stack style={{ fontSize: '0.75rem' }}>
            <Text>
              {alertText ??
                strings?.incomingCallNotificationPlaceholderAlert ??
                /* @conditional-compile-remove(one-to-n-calling) */ formattedMessageString}
            </Text>
          </Stack>
        </Stack>
        <IconButton iconProps={{ iconName: 'cancel' }} onClick={onDismiss} styles={dismissButtonStyle(theme)} />
      </Stack>

      <Stack horizontal styles={buttonContainerStyles} tokens={{ childrenGap: 10 }}>
        <PrimaryButton
          styles={styles?.acceptButton ? styles.acceptButton : incomingCallAcceptButtonStyle(theme)}
          onClick={() => onAcceptWithAudio()}
          iconProps={{ iconName: 'IncomingCallNotificationAcceptIcon', style: { lineHeight: '1rem' } }}
          /* @conditional-compile-remove(one-to-n-calling) */
          ariaLabel={
            strings?.incomingCallNoticicationAcceptWithAudioAriaLabel ??
            localeStrings.incomingCallNoticicationAcceptWithAudioAriaLabel
          }
        >
          {strings?.incomingCallNotificationAcceptButtonLabel ??
            localeStrings.incomingCallNotificationAcceptButtonLabel}
        </PrimaryButton>
        <PrimaryButton
          styles={styles?.acceptButton ? styles.acceptButton : incomingCallAcceptButtonStyle(theme)}
          onClick={() => onAcceptWithVideo()}
          iconProps={{ iconName: 'IncomingCallNotificationAcceptWithVideoIcon' }}
          /* @conditional-compile-remove(one-to-n-calling) */
          ariaLabel={
            strings?.incomingCallNoticicationAcceptWithVideoAriaLabel ??
            localeStrings.incomingCallNoticicationAcceptWithVideoAriaLabel
          }
        >
          {strings?.incomingCallNotificationAccceptWithVideoButtonLabel ??
            localeStrings.incomingCallNotificationAccceptWithVideoButtonLabel}
        </PrimaryButton>
        <DefaultButton
          styles={styles?.rejectButton ? styles.rejectButton : incomingCallRejectButtonStyle(theme)}
          onClick={() => onReject()}
          label={'Decline'}
          iconProps={{ iconName: 'IncomingCallNotificationRejectIcon' }}
          /* @conditional-compile-remove(one-to-n-calling) */
          ariaLabel={
            strings?.incomingCallNoticicationRejectAriaLabel ?? localeStrings.incomingCallNoticicationRejectAriaLabel
          }
        >
          {strings?.incomingCallNotificationRejectButtonLabel ??
            localeStrings.incomingCallNotificationRejectButtonLabel}
        </DefaultButton>
      </Stack>
    </Stack>
  );
};

const incomingCallToastStyle = (theme: Theme): IStackStyles => {
  return {
    root: {
      width: '20rem',
      background: theme.palette.white,
      opacity: 0.95,
      borderRadius: '0.5rem',
      boxShadow: theme.effects.elevation8,
      padding: '1rem'
    }
  };
};

const buttonContainerStyles: IStackStyles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
};

const incomingCallToastAvatarContainerStyle: IStackStyles = {
  root: {
    marginRight: '0.5rem'
  }
};

const dismissButtonStyle = (theme: Theme): IButtonStyles => {
  return {
    root: {
      color: theme.palette.neutralPrimary,
      width: '1rem',
      height: '1rem'
    },
    rootHovered: {
      color: theme.palette.neutralDark
    }
  };
};

const incomingCallAcceptButtonStyle = (theme: Theme): IButtonStyles => {
  return {
    root: {
      color: theme.palette.white,
      border: 'none',
      borderRadius: theme.effects.roundedCorner4
    },
    rootHovered: {
      color: theme.palette.white
    },
    icon: {
      height: '1.25rem'
    }
  };
};

const incomingCallRejectButtonStyle = (theme: Theme): IButtonStyles => {
  return {
    root: {
      borderRadius: theme.effects.roundedCorner4
    },
    icon: {
      height: '1.25rem'
    }
  };
};
