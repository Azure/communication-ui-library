// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import {
  Stack,
  Text,
  Link,
  Icon,
  useTheme,
  PrimaryButton,
  ILinkStyles,
  IButtonStyles,
  mergeStyleSets
} from '@fluentui/react';
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
import {
  iconBannerContainerStyles,
  iconContainerStyles,
  iconPrimaryStyles,
  linkTextStyles,
  primaryButtonStyles,
  primaryTextStyles,
  secondaryTextStyles,
  sparkleIconBackdropStyles,
  textContainerStyles
} from '../styles/SitePermissions.styles';
import { isValidString } from '../utils';
import { BaseCustomStyles } from '../../types';

/**
 * @private
 * Props for SitePermissions component.
 */
export interface SitePermissionsContainerProps {
  /**
   * Name of application calling experience is in.
   */
  appName?: string;
  /**
   * Name of icon to be used for the camera icon.
   * If this is not provided the icon will not be shown.
   */
  cameraIconName?: string;
  /**
   * Name of icon to be used for the sparkle icon.
   * If this is not provided the icon will not be shown.
   */
  connectorIconName?: string;
  /**
   * Name of icon to be used for the mic icon.
   * If this is not provided the icon will not be shown.
   */
  microphoneIconName?: string;
  /**
   * Action to be taken by the more help link. Possible to send to external page or show other modal.
   * If this is not provided the button will not be shown.
   */
  onTroubleshootingClick?: () => void;
  /**
   * Action that is taken when the user clicks an optional primary button.
   * If this is not provided the button will not be shown.
   */
  onPrimaryButtonClick?: () => void;
  /**
   * Localization strings for SitePermissions component.
   */
  strings?: SitePermissionsStrings;
  /**
   * Styles for SitePermissions component.
   */
  styles?: SitePermissionsStyles;
}

/**
 * @beta
 * Strings for SitePermissions component
 */
export type SitePermissionsStrings = {
  /**
   * Main text string.
   */
  primaryText?: string;
  /**
   * Subtext string.
   */
  secondaryText?: string;
  /**
   * More help link string.
   */
  linkText?: string;
  /**
   * Primary button text string.
   */
  primaryButtonText?: string;
  /**
   * Aria label describing the content of the container
   */
  ariaLabel?: string;
};

/**
 * Fluent styles for {@link SitePermissionsContainer}.
 *
 * @beta
 */
export interface SitePermissionsStyles extends BaseCustomStyles {
  /** Styles for the primary button. */
  primaryButton?: IButtonStyles;
  /** Styles for the help troubleshooting link text. */
  troubleshootingLink?: ILinkStyles;
}

/**
 * spacing for the icons in the banner.
 */
const tokens = { childrenGap: '2rem' };

/** @private */
export const SitePermissionsContainer = (props: SitePermissionsContainerProps): JSX.Element => {
  const { appName, onTroubleshootingClick, onPrimaryButtonClick, strings } = props;
  const theme = useTheme();

  return (
    <Stack style={{ padding: '2rem', maxWidth: '25.375rem', alignSelf: 'center' }} aria-label={strings?.ariaLabel}>
      <Stack styles={iconBannerContainerStyles} horizontal horizontalAlign={'center'} verticalFill tokens={tokens}>
        {props.cameraIconName && (
          <Stack>
            <Icon styles={iconPrimaryStyles} iconName={props.cameraIconName}></Icon>
          </Stack>
        )}
        {props.connectorIconName && (
          <Stack styles={iconContainerStyles} horizontal>
            <Icon styles={sparkleIconBackdropStyles(theme)} iconName={props.connectorIconName}></Icon>
          </Stack>
        )}
        {props.microphoneIconName && (
          <Stack>
            <Icon styles={iconPrimaryStyles} iconName={props.microphoneIconName}></Icon>
          </Stack>
        )}
      </Stack>
      <Stack styles={textContainerStyles}>
        {strings && isValidString(strings?.primaryText) && (
          <Text styles={primaryTextStyles}>
            {appName ? _formatString(strings.primaryText, { appName: appName }) : strings.primaryText}
          </Text>
        )}
        {strings && isValidString(strings?.secondaryText) && (
          <Text styles={secondaryTextStyles}>{strings?.secondaryText}</Text>
        )}

        {onPrimaryButtonClick && isValidString(strings?.primaryButtonText) && (
          <PrimaryButton
            styles={mergeStyleSets(primaryButtonStyles, props.styles?.primaryButton)}
            text={strings?.primaryButtonText}
            onClick={onPrimaryButtonClick}
          />
        )}
        {onTroubleshootingClick && isValidString(strings?.linkText) && (
          <Link
            styles={mergeStyleSets(linkTextStyles, props.styles?.troubleshootingLink)}
            onClick={onTroubleshootingClick}
          >
            {strings?.linkText}
          </Link>
        )}
      </Stack>
    </Stack>
  );
};
