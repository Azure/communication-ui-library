// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState } from 'react';
import { CameraSplitButtonProps } from './CameraSplitButton.types';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { SplitButton, resolveShorthand } from '@fluentui/react-components';
import { Video20Filled, VideoOff20Filled } from '@fluentui/react-icons';
import { _Announcer } from '../../Announcer/Announcer';
import { useLocale } from '../../localization';
import { CameraButtonTooltip } from '../CameraButtonTooltip';

/** @public */
export const CameraSplitButton: ForwardRefComponent<CameraSplitButtonProps> = React.forwardRef((props, ref) => {
  const { tooltip, primaryActionButton, menuButton, cameraOn, onToggleCamera, ...restOfProps } = props;

  const strings = useLocale().strings.cameraButton;

  const [announcerString, setAnnouncerString] = useState<string | undefined>(undefined);
  const toggleAnnouncerString = useCallback(
    (isCameraOn: boolean) => {
      setAnnouncerString(
        !isCameraOn ? strings.cameraActionTurnedOffAnnouncement : strings.cameraActionTurnedOnAnnouncement
      );
    },
    [strings.cameraActionTurnedOffAnnouncement, strings.cameraActionTurnedOnAnnouncement]
  );

  const [waitForCamera, setWaitForCamera] = useState(false);
  const disabled = props.disabled || waitForCamera;

  const onClick = useCallback(
    async (ev: React.MouseEvent<HTMLButtonElement, MouseEvent> & React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setWaitForCamera(true);

      try {
        await onToggleCamera(ev, { cameraOn: cameraOn });
        // TODO: I strongly feel this should not live inside the button component. Migrating here for now as this exists in our current camera button component.
        toggleAnnouncerString(!cameraOn);
      } finally {
        setWaitForCamera(false);
      }
    },
    [cameraOn, onToggleCamera, toggleAnnouncerString]
  );

  const buttonProps = resolveShorthand(primaryActionButton, {
    required: true,
    defaultProps: {
      children: strings.label,
      onClick: onClick,
      icon: cameraOn ? <Video20Filled /> : <VideoOff20Filled />,
      disabled,
      size: 'large',
      disabledFocusable: disabled
    }
  });

  const menuButtonProps = resolveShorthand(menuButton, {
    required: true,
    defaultProps: {
      disabled,
      disabledFocusable: false
    }
  });

  const cameraState = waitForCamera ? 'loading' : disabled ? 'disabled' : cameraOn ? 'on' : 'off';
  const tooltipProps = resolveShorthand(tooltip, {
    required: true,
    defaultProps: {
      cameraState: cameraState
    }
  });

  return (
    <CameraButtonTooltip {...tooltipProps}>
      <div {...restOfProps} ref={ref}>
        <SplitButton primaryActionButton={{ ...buttonProps }} menuButton={{ ...menuButtonProps }} />
        <_Announcer announcementString={announcerString} ariaLive={'polite'} />
      </div>
    </CameraButtonTooltip>
  );
});

CameraSplitButton.displayName = 'CameraSplitButton';
