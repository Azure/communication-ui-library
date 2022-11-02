// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Stack, Text, Link, Icon, useTheme, PrimaryButton } from '@fluentui/react';
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
import {
  iconContainerStyles,
  iconPrimaryStyles,
  linkTextStyles,
  primaryButtonStyles,
  primaryTextStyles,
  secondaryTextStyles,
  sparkleIconBackdropStyles,
  textContainerStyles
} from '../styles/DomainPermissions.styles';
import { isValidString } from '../utils';

/**
 * @private
 * Props for DomainPermissions component.
 */
export interface DomainPermissionsContainerProps {
  /**
   * Name of application calling experience is in.
   */
  appName: string;
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
  micIconName?: string;
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
   * Localization strings for DomainPermissions component.
   */
  strings?: DomainPermissionsStrings;
}

/**
 * @beta
 * Strings for DomainPermissions component
 */
export type DomainPermissionsStrings = {
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

/** @private */
export const DomainPermissionsContainer = (props: DomainPermissionsContainerProps): JSX.Element => {
  const { appName, onTroubleshootingClick, onPrimaryButtonClick, strings } = props;
  const theme = useTheme();
  return (
    <Stack style={{ padding: '2rem', maxWidth: '25.375rem' }} aria-label={strings?.ariaLabel}>
      <Stack horizontal style={{ paddingBottom: '1rem' }} horizontalAlign={'space-between'}>
        {props.cameraIconName && (
          <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
            <Icon styles={iconPrimaryStyles} iconName={props.cameraIconName}></Icon>
          </Stack>
        )}
        {props.connectorIconName && (
          <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
            <Icon styles={sparkleIconBackdropStyles(theme)} iconName={props.connectorIconName}></Icon>
          </Stack>
        )}
        {props.micIconName && (
          <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
            <Icon styles={iconPrimaryStyles} iconName={props.micIconName}></Icon>
          </Stack>
        )}
      </Stack>
      <Stack styles={textContainerStyles}>
        {strings && isValidString(strings?.primaryText) && (
          <Text styles={primaryTextStyles}>{_formatString(strings.primaryText, { appName: appName })}</Text>
        )}
        {strings && isValidString(strings?.secondaryText) && (
          <Text styles={secondaryTextStyles}>{strings?.secondaryText}</Text>
        )}

        {onPrimaryButtonClick && isValidString(strings?.primaryButtonText) && (
          <PrimaryButton
            styles={primaryButtonStyles}
            text={strings?.primaryButtonText}
            onClick={onPrimaryButtonClick}
          />
        )}
        {onTroubleshootingClick && isValidString(strings?.linkText) && (
          <Link styles={linkTextStyles} onClick={onTroubleshootingClick}>
            {strings?.linkText}
          </Link>
        )}
      </Stack>
    </Stack>
  );
};
