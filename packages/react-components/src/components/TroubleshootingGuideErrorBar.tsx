// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { Link, MessageBar, PrimaryButton, Stack, useTheme } from '@fluentui/react';
import { useLocale } from '../localization';
import { ErrorBarProps } from './ErrorBar';
import { confirmButtonStyle, linkStyle, messageBarStyle } from './styles/TroubleShootingGuideErrorBar.styles';
import {
  DismissedError,
  dismissError,
  dropDismissalsForInactiveErrors,
  errorsToShow,
  messageBarIconProps,
  messageBarType
} from './utils';

/**
 * Strings for {@link _TroubleShootingGuideErrorBar}.
 *
 * @internal
 */
export interface _TroubleShootingGuideErrorBarStrings {
  linkText?: string;
  buttonText?: string;
}

/**
 * Props for {@link _TroubleShootingGuideErrorBar}.
 *
 * @internal
 */
export interface _TroubleShootingGuideErrorBarProps extends ErrorBarProps {
  /**
   * permissions state for camera/microphone
   */
  permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  };
  /**
   * Callback you may provide to supply users with further steps to troubleshoot why they have been
   * unable to grant your site the required permissions for the call.
   *
   * @example
   * ```ts
   * onPermissionsTroubleshootingClick: () =>
   *  window.open('https://contoso.com/permissions-troubleshooting', '_blank');
   * ```
   *
   * @remarks
   * if this is not supplied, the composite will not show a 'further troubleshooting' link.
   */
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void;
  /**
   * Optional callback to supply users with further troubleshooting steps for network issues
   * experienced when connecting to a call.
   *
   * @example
   * ```ts
   * onNetworkingTroubleShootingClick?: () =>
   *  window.open('https://contoso.com/network-troubleshooting', '_blank');
   * ```
   *
   * @remarks
   * if this is not supplied, the composite will not show a 'network troubleshooting' link.
   */
  onNetworkingTroubleShootingClick?: () => void;
  /**
   * strings related to trouble shooting guidance link and dismiss button
   */
  troubleShootingGuideStrings: _TroubleShootingGuideErrorBarStrings;
}

/**
 * @internal
 * A component to show device Permission/network connection related errors, contains link that leads to further trouble shooting guide
 */
export const _TroubleShootingGuideErrorBar = (props: _TroubleShootingGuideErrorBarProps): JSX.Element => {
  const theme = useTheme();
  // error bar strings
  const localeStrings = useLocale().strings.errorBar;
  const strings = props.strings ?? localeStrings;

  const [dismissedErrors, setDismissedErrors] = useState<DismissedError[]>([]);

  const {
    onPermissionsTroubleshootingClick,
    onNetworkingTroubleShootingClick,
    permissionsState,
    troubleShootingGuideStrings
  } = props;

  // dropDismissalsForInactiveErrors only returns a new object if `dismissedErrors` actually changes.
  // Without this behaviour, this `useEffect` block would cause a render loop.
  useEffect(
    () => setDismissedErrors(dropDismissalsForInactiveErrors(props.activeErrorMessages, dismissedErrors)),
    [props.activeErrorMessages, dismissedErrors]
  );

  const toShow = errorsToShow(props.activeErrorMessages, dismissedErrors);

  return (
    <Stack data-ui-id="error-bar-stack">
      {toShow.map((error) => (
        <MessageBar
          {...props}
          styles={messageBarStyle(theme, messageBarType(error.type))}
          key={error.type}
          messageBarType={messageBarType(error.type)}
          messageBarIconProps={messageBarIconProps(error.type)}
        >
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            {onPermissionsTroubleshootingClick || onNetworkingTroubleShootingClick ? (
              <div>
                {strings[error.type]}
                <Link
                  styles={linkStyle(theme)}
                  onClick={() => {
                    if (onPermissionsTroubleshootingClick) {
                      onPermissionsTroubleshootingClick(permissionsState);
                    } else if (onNetworkingTroubleShootingClick) {
                      onNetworkingTroubleShootingClick();
                    }
                  }}
                  underline
                >
                  <span>{troubleShootingGuideStrings.linkText}</span>
                </Link>
              </div>
            ) : (
              <div>{strings[error.type]} </div>
            )}
            <PrimaryButton
              text={troubleShootingGuideStrings.buttonText}
              styles={confirmButtonStyle(theme)}
              onClick={() => {
                setDismissedErrors(dismissError(dismissedErrors, error));
              }}
              ariaLabel={strings.dismissButtonAriaLabel}
            />
          </Stack>
        </MessageBar>
      ))}
    </Stack>
  );
};
