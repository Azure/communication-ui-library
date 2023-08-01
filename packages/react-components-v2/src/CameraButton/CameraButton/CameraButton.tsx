// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState } from 'react';
import { CameraButtonProps } from './CameraButton.types';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { Button, resolveShorthand } from '@fluentui/react-components';
import { Video20Filled, VideoOff20Filled } from '@fluentui/react-icons';
import { _Announcer } from '../../Announcer/Announcer';
import { useLocale } from '../../localization';
import { CameraButtonTooltip } from '../CameraButtonTooltip';

/** @public */
export const CameraButton: ForwardRefComponent<CameraButtonProps> = React.forwardRef((props, ref) => {
  const { button, tooltip, cameraOn, onToggleCamera, hideLabel, ...restOfProps } = props;

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
      // TODO: move this outside of the component, this should be parent driven. Instead change cameraOn to cameraState: on | off | loading. Selector will handle this in the usePropsFor
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

  const buttonProps = resolveShorthand(button, {
    required: true,
    defaultProps: {
      children: hideLabel ? undefined : strings.label,
      onClick: onClick,
      icon: cameraOn ? <Video20Filled /> : <VideoOff20Filled />,
      disabled,
      size: 'large',
      disabledFocusable: disabled
    }
  });

  const cameraState = disabled ? 'disabled' : waitForCamera ? 'loading' : cameraOn ? 'on' : 'off';
  const tooltipProps = resolveShorthand(tooltip, {
    required: true,
    defaultProps: {
      cameraState: cameraState
    }
  });

  return (
    <CameraButtonTooltip {...tooltipProps}>
      <div {...restOfProps} ref={ref}>
        <Button {...buttonProps} />
        <_Announcer announcementString={announcerString} ariaLive={'polite'} />
      </div>
    </CameraButtonTooltip>
  );
});

CameraButton.displayName = 'CameraButton';
