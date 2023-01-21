// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { useLocale } from '../../localization';
import { SitePermissionsStrings, SitePermissionsStyles } from './SitePermissionsScaffolding';
/* @conditional-compile-remove(call-readiness) */
import { SitePermissionsContainer } from './SitePermissionsScaffolding';
/* @conditional-compile-remove(call-readiness) */
import { useShallowMerge } from '../utils/merge';

/**
 * @beta
 * Props for SitePermissions components.
 */
export interface CommonSitePermissionsProps {
  /**
   * Name of application calling experience is in.
   */
  appName: string;
  /**
   * Kind of the Site Permissions component.
   */
  kind: 'request' | 'denied' | 'check';
  /**
   * Type of the browser used, the Site permission component will show different guidance text based on the browser type
   */
  browserHint?: 'safari' | 'unset';
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
   * Styles for SitePermissions component.
   */
  styles?: SitePermissionsStyles;
}

/**
 * @beta
 * Strings for CameraAndMicrophoneSitePermissions component.
 */
export type CameraAndMicrophoneSitePermissionsStrings = SitePermissionsStrings;

/**
 * @beta
 * Props for CameraAndMicrophoneSitePermissions component.
 */
export interface CameraAndMicrophoneSitePermissionsProps extends CommonSitePermissionsProps {
  /** Icon name for the camera icon */
  cameraIconName?: string;
  /** Icon name for the microphone icon */
  microphoneIconName?: string;
  /** Icon name for the central icon between the camera and microphone icons */
  connectorIconName?: string;
  /** Strings for use with the {@link CameraAndMicrophoneSitePermissions} */
  strings?: CameraAndMicrophoneSitePermissionsStrings;
}

/**
 * @beta
 *
 * Component to allow Contoso to help their end user with their devices should their permissions be blocked
 * by their browsers settings.
 */
export const CameraAndMicrophoneSitePermissions = (props: CameraAndMicrophoneSitePermissionsProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const locale = useLocale().strings;

  /* @conditional-compile-remove(call-readiness) */
  const strings = useShallowMerge(
    props.kind === 'denied'
      ? props.browserHint === 'safari'
        ? locale.CameraAndMicrophoneSitePermissionsDeniedSafari
        : locale.CameraAndMicrophoneSitePermissionsDenied
      : props.kind === 'request'
      ? locale.CameraAndMicrophoneSitePermissionsRequest
      : locale.CameraAndMicrophoneSitePermissionsCheck,
    props.strings
  );

  /* @conditional-compile-remove(call-readiness) */
  const cameraIconName =
    props.microphoneIconName ?? props.kind === 'denied' ? 'SitePermissionCameraDenied' : 'SitePermissionCamera';
  /* @conditional-compile-remove(call-readiness) */
  const microphoneIconName =
    props.microphoneIconName ?? props.kind === 'denied' ? 'SitePermissionMicDenied' : 'SitePermissionMic';
  /* @conditional-compile-remove(call-readiness) */
  const connectorIconName = props.microphoneIconName ?? 'SitePermissionsSparkle';

  /* @conditional-compile-remove(call-readiness) */
  return (
    <SitePermissionsContainer
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
 * Strings for MicrophoneSitePermissions component.
 */
export type MicrophoneSitePermissionsStrings = SitePermissionsStrings;

/**
 * @beta
 * Props for MicrophoneSitePermissions component.
 */
export interface MicrophoneSitePermissionsProps extends CommonSitePermissionsProps {
  /** Icon name for the microphone icon */
  microphoneIconName?: string;
  /** Strings for use with the {@link MicrophoneSitePermissions} */
  strings?: MicrophoneSitePermissionsStrings;
}

/**
 * Component to allow Contoso to help their end user with their devices should their permissions be blocked
 * by their browsers settings.
 *
 * @beta
 */
export const MicrophoneSitePermissions = (props: MicrophoneSitePermissionsProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const locale = useLocale().strings;

  /* @conditional-compile-remove(call-readiness) */
  const strings = useShallowMerge(
    props.kind === 'denied'
      ? props.browserHint === 'safari'
        ? locale.MicrophoneSitePermissionsDeniedSafari
        : locale.MicrophoneSitePermissionsDenied
      : props.kind === 'request'
      ? locale.MicrophoneSitePermissionsRequest
      : locale.MicrophoneSitePermissionsCheck,
    props.strings
  );

  /* @conditional-compile-remove(call-readiness) */
  const iconName =
    props.microphoneIconName ?? props.kind === 'denied' ? 'SitePermissionMicDenied' : 'SitePermissionMic';

  /* @conditional-compile-remove(call-readiness) */
  return (
    <SitePermissionsContainer
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
 * Strings for CameraSitePermissions component.
 */
export type CameraSitePermissionsStrings = SitePermissionsStrings;

/**
 * @beta
 * Props for CameraSitePermissions component.
 */
export interface CameraSitePermissionsProps extends CommonSitePermissionsProps {
  /** Icon name for the camera icon */
  cameraIconName?: string;
  /** Strings for use with the {@link CameraSitePermissions} */
  strings?: CameraSitePermissionsStrings;
}

/**
 * Component to allow Contoso to help their end user with their devices should their permissions be blocked
 * by their browsers settings.
 *
 * @beta
 */
export const CameraSitePermissions = (props: CameraSitePermissionsProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const locale = useLocale().strings;

  /* @conditional-compile-remove(call-readiness) */
  const strings = useShallowMerge(
    props.kind === 'denied'
      ? props.browserHint === 'safari'
        ? locale.CameraSitePermissionsDeniedSafari
        : locale.CameraSitePermissionsDenied
      : props.kind === 'request'
      ? locale.CameraSitePermissionsRequest
      : locale.CameraSitePermissionsCheck,
    props.strings
  );

  /* @conditional-compile-remove(call-readiness) */
  const iconName =
    props.cameraIconName ?? props.kind === 'denied' ? 'SitePermissionCameraDenied' : 'SitePermissionCamera';

  /* @conditional-compile-remove(call-readiness) */
  return (
    <SitePermissionsContainer
      {...props}
      strings={strings}
      microphoneIconName={iconName}
      onPrimaryButtonClick={props.onContinueAnywayClick}
    />
  );
  return <></>;
};
