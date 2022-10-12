// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

/**
 * @beta
 * Props for DomainPermissions component.
 */
export interface DomainPermissionsProps {
  /**
   * Name of application calling experience is in.
   */
  appName: string;
  /**
   * Action to be taken by the more help link. Possible to send to external page or show other modal.
   */
  onTroubleshootingClick: () => void;
  /**
   * Localization strings for DomainPermissions component.
   */
  strings: DomainPermissionsStrings;
}

/**
 * @beta
 * Strings for DomainPermissions component
 */
export interface DomainPermissionsStrings {
  /**
   * Main text string.
   */
  primaryText: string;
  /**
   * Subtext string.
   */
  secondaryText: string;
  /**
   * More help link string.
   */
  linkText: string;
}

/**
 * @beta
 *
 * Component to allow Contoso to help their end user with their devices should their permissions be blocked
 * by their browsers settings.
 */
export const DomainPermissions = (props: DomainPermissionsProps): JSX.Element => {
  return <></>;
};
