// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { useLocale } from '../../localization';
import { DomainPermissionsStrings, DomainPermissionsStyles } from './DomainPermissionsScaffolding';
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
   * Type of the Domain Permissions component.
   */
  type: 'request' | 'denied' | 'check';
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
  /**
   * Styles for DomainPermissions component.
   */
  styles?: DomainPermissionsStyles;
}

/**
 * @beta
 * Strings for CameraAndMicrophoneDomainPermissions component.
 */
export type CameraAndMicrophoneDomainPermissionsStrings = DomainPermissionsStrings;

/**
 * @beta
 * Props for CameraAndMicrophoneDomainPermissions component.
 */
export interface CameraAndMicrophoneDomainPermissionsProps extends CommonDomainPermissionsProps {
  /** Icon name for the camera icon */
  cameraIconName?: string;
  /** Icon name for the microphone icon */
  microphoneIconName?: string;
  /** Icon name for the central icon between the camera and microphone icons */
  connectorIconName?: string;
  /** Strings for use with the {@link CameraAndMicrophoneDomainPermissions} */
  strings?: CameraAndMicrophoneDomainPermissionsStrings;
}

/**
 * @beta
 *
 * Component to allow Contoso to help their end user with their devices should their permissions be blocked
 * by their browsers settings.
 */
export const CameraAndMicrophoneDomainPermissions = (props: CameraAndMicrophoneDomainPermissionsProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const locale = useLocale().strings;

  /* @conditional-compile-remove(call-readiness) */
  const strings = useShallowMerge(
    props.type === 'denied'
      ? locale.CameraAndMicrophoneDomainPermissionsDenied
      : props.type === 'request'
      ? locale.CameraAndMicrophoneDomainPermissionsRequest
      : locale.CameraAndMicrophoneDomainPermissionsCheck,
    props.strings
  );

  /* @conditional-compile-remove(call-readiness) */
  const cameraIconName =
    props.microphoneIconName ?? props.type === 'denied' ? 'DomainPermissionCameraDenied' : 'DomainPermissionCamera';
  /* @conditional-compile-remove(call-readiness) */
  const microphoneIconName =
    props.microphoneIconName ?? props.type === 'denied' ? 'DomainPermissionMicDenied' : 'DomainPermissionMic';
  /* @conditional-compile-remove(call-readiness) */
  const connectorIconName = props.microphoneIconName ?? 'DomainPermissionsSparkle';

  /* @conditional-compile-remove(call-readiness) */
  return (
    <DomainPermissionsContainer
      {...props}
      strings={strings}
      cameraIconName={cameraIconName}
      connectorIconName={connectorIconName}
      microphoneIconName={microphoneIconName}
      onPrimaryButtonClick={props.onContinueAnywayClick}
    />
  );
  return <></>;
};

/**
 * @beta
 * Strings for MicrophoneDomainPermissions component.
 */
export type MicrophoneDomainPermissionsStrings = DomainPermissionsStrings;

/**
 * @beta
 * Props for MicrophoneDomainPermissions component.
 */
export interface MicrophoneDomainPermissionsProps extends CommonDomainPermissionsProps {
  /** Icon name for the microphone icon */
  microphoneIconName?: string;
  /** Strings for use with the {@link MicrophoneDomainPermissions} */
  strings?: MicrophoneDomainPermissionsStrings;
}

/**
 * Component to allow Contoso to help their end user with their devices should their permissions be blocked
 * by their browsers settings.
 *
 * @beta
 */
export const MicrophoneDomainPermissions = (props: MicrophoneDomainPermissionsProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const locale = useLocale().strings;

  /* @conditional-compile-remove(call-readiness) */
  const strings = useShallowMerge(
    props.type === 'denied'
      ? locale.MicrophoneDomainPermissionsDenied
      : props.type === 'request'
      ? locale.MicrophoneDomainPermissionsRequest
      : locale.MicrophoneDomainPermissionsCheck,
    props.strings
  );

  /* @conditional-compile-remove(call-readiness) */
  const iconName =
    props.microphoneIconName ?? props.type === 'denied' ? 'DomainPermissionMicDenied' : 'DomainPermissionMic';

  /* @conditional-compile-remove(call-readiness) */
  return (
    <DomainPermissionsContainer
      {...props}
      strings={strings}
      cameraIconName={iconName}
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
  /** Icon name for the camera icon */
  cameraIconName?: string;
  /** Strings for use with the {@link CameraDomainPermissions} */
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
  const locale = useLocale().strings;

  /* @conditional-compile-remove(call-readiness) */
  const strings = useShallowMerge(
    props.type === 'denied'
      ? locale.CameraDomainPermissionsDenied
      : props.type === 'request'
      ? locale.CameraDomainPermissionsRequest
      : locale.CameraDomainPermissionsCheck,
    props.strings
  );

  /* @conditional-compile-remove(call-readiness) */
  const iconName =
    props.cameraIconName ?? props.type === 'denied' ? 'DomainPermissionCameraDenied' : 'DomainPermissionCamera';

  /* @conditional-compile-remove(call-readiness) */
  return (
    <DomainPermissionsContainer
      {...props}
      strings={strings}
      microphoneIconName={iconName}
      onPrimaryButtonClick={props.onContinueAnywayClick}
    />
  );
  return <></>;
};
