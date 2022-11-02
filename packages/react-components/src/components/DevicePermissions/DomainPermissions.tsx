// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { useLocale } from '../../localization';
import { DomainPermissionsStrings } from './DomainPermissionsScaffolding';
/* @conditional-compile-remove(call-readiness) */
import { DomainPermissionsContainer } from './DomainPermissionsScaffolding';
/* @conditional-compile-remove(call-readiness) */
import { useShallowMerge } from '../utils/merge';

/**
 * @beta
 * Props for DomainPermissions components.
 */
export interface CommonDomainPermissionsProps {
  /**
   * Name of application calling experience is in.
   */
  appName: string;
  /**
   * Action to be taken by the more help link. Possible to send to external page or show other modal.
   * If this is not provided the button will not be shown.
   */
  onTroubleshootingClick?: () => void;
  /**
   * Action that is taken when the user clicks the continue anyway button.
   * If this is not provided the button will not be shown.
   */
  onContinueAnywayClick?: () => void;
}

/**
 * @beta
 * Strings for CameraAndMicDomainPermissions component.
 */
export type CameraAndMicDomainPermissionsStrings = DomainPermissionsStrings;

/**
 * @beta
 * Props for CameraAndMicDomainPermissions component.
 */
export interface CameraAndMicDomainPermissionsProps extends CommonDomainPermissionsProps {
  cameraIconName?: string;
  micIconName?: string;
  connectorIconName?: string;
  strings?: CameraAndMicDomainPermissionsStrings;
}

/**
 * @beta
 *
 * Component to allow Contoso to help their end user with their devices should their permissions be blocked
 * by their browsers settings.
 */
export const CameraAndMicDomainPermissions = (props: CameraAndMicDomainPermissionsProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const locale = useLocale().strings.CameraAndMicDomainPermissions;

  /* @conditional-compile-remove(call-readiness) */
  const strings = useShallowMerge(locale, props.strings);

  /* @conditional-compile-remove(call-readiness) */
  return (
    <DomainPermissionsContainer
      {...props}
      strings={strings}
      cameraIconName={props.cameraIconName ?? 'DomainPermissionCamera'}
      connectorIconName={props.cameraIconName ?? 'DomainPermissionsSparkle'}
      micIconName={props.cameraIconName ?? 'DomainPermissionMic'}
      onPrimaryButtonClick={props.onContinueAnywayClick}
    />
  );
  return <></>;
};

/**
 * @beta
 * Strings for MicDomainPermissions component.
 */
export type MicDomainPermissionsStrings = DomainPermissionsStrings;

/**
 * @beta
 * Props for MicDomainPermissions component.
 */
export interface MicDomainPermissionsProps extends CommonDomainPermissionsProps {
  microphoneIconName?: string;
  strings?: MicDomainPermissionsStrings;
}

/**
 * Component to allow Contoso to help their end user with their devices should their permissions be blocked
 * by their browsers settings.
 *
 * @beta
 */
export const MicDomainPermissions = (props: MicDomainPermissionsProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const locale = useLocale().strings.MicDomainPermissions;

  /* @conditional-compile-remove(call-readiness) */
  const strings = useShallowMerge(locale, props.strings);

  /* @conditional-compile-remove(call-readiness) */
  return (
    <DomainPermissionsContainer
      {...props}
      strings={strings}
      cameraIconName={props.microphoneIconName ?? 'DomainPermissionMic'}
      onPrimaryButtonClick={props.onContinueAnywayClick}
    />
  );
  return <></>;
};

/**
 * @beta
 * Strings for CameraDomainPermissions component.
 */
export type CameraDomainPermissionsStrings = DomainPermissionsStrings;

/**
 * @beta
 * Props for CameraDomainPermissions component.
 */
export interface CameraDomainPermissionsProps extends CommonDomainPermissionsProps {
  cameraIconName?: string;
  strings?: CameraDomainPermissionsStrings;
}

/**
 * Component to allow Contoso to help their end user with their devices should their permissions be blocked
 * by their browsers settings.
 *
 * @beta
 */
export const CameraDomainPermissions = (props: CameraDomainPermissionsProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const locale = useLocale().strings.CameraDomainPermissions;

  /* @conditional-compile-remove(call-readiness) */
  const strings = useShallowMerge(locale, props.strings);

  /* @conditional-compile-remove(call-readiness) */
  return (
    <DomainPermissionsContainer
      {...props}
      strings={strings}
      micIconName={props.cameraIconName ?? 'DomainPermissionCamera'}
      onPrimaryButtonClick={props.onContinueAnywayClick}
    />
  );
  return <></>;
};
