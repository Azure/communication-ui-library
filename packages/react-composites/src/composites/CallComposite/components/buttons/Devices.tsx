// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ControlBarButtonStyles, DevicesButton } from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { _usePermissions, _Permissions, DevicesButtonStrings } from '@internal/react-components';
import React, { useMemo } from 'react';
import { usePropsFor } from '../../hooks/usePropsFor';
import { concatButtonBaseStyles, devicesButtonWithIncreasedTouchTargets } from '../../styles/Buttons.styles';
/* @conditional-compile-remove(rooms) */
import { CompositeLocale, useLocale } from '../../../localization';
import { _HighContrastAwareIcon } from '@internal/react-components';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';

/** @private */
export const Devices = (props: {
  displayType?: CallControlDisplayType;
  increaseFlyoutItemSize?: boolean;
  styles?: ControlBarButtonStyles;
  disabled?: boolean;
}): JSX.Element => {
  const devicesButtonProps = usePropsFor(DevicesButton);
  /* @conditional-compile-remove(rooms) */
  const permissions = _usePermissions();

  const augmentedDeviceButtonProps = useMemo(
    () => ({
      ...devicesButtonProps,
      /* @conditional-compile-remove(rooms) */
      microphones: !permissions.microphoneButton ? [] : devicesButtonProps.microphones,
      /* @conditional-compile-remove(rooms) */
      cameras: !permissions.cameraButton ? [] : devicesButtonProps.cameras
    }),
    [
      devicesButtonProps,
      /* @conditional-compile-remove(rooms) */
      permissions
    ]
  );
  const styles = useMemo(
    () =>
      concatButtonBaseStyles(
        props.increaseFlyoutItemSize ? devicesButtonWithIncreasedTouchTargets : {},
        props.styles ?? {}
      ),
    [props.increaseFlyoutItemSize, props.styles]
  );
  /* @conditional-compile-remove(rooms) */
  const locale = useLocale();
  /* @conditional-compile-remove(rooms) */
  const onlyManageSpeakers = !permissions.microphoneButton && !permissions.cameraButton;

  /* @conditional-compile-remove(rooms) */
  const onRenderDevicesIcon = (): JSX.Element => {
    return <_HighContrastAwareIcon disabled={props.disabled} iconName="OptionsSpeaker" />;
  };

  return (
    <DevicesButton
      /* By setting `persistMenu?` to true, we prevent options menu from getting hidden every time a participant joins or leaves. */
      persistMenu={true}
      {...augmentedDeviceButtonProps}
      showLabel={props.displayType !== 'compact'}
      styles={styles}
      data-ui-id="calling-composite-devices-button"
      disabled={props.disabled}
      /* @conditional-compile-remove(rooms) */
      strings={getLabelFromPermissions(permissions, locale)}
      /* @conditional-compile-remove(rooms) */
      onRenderIcon={onlyManageSpeakers ? onRenderDevicesIcon : undefined}
    />
  );
};

/* @conditional-compile-remove(rooms) */
const getLabelFromPermissions = (
  permissions: _Permissions,
  locale: CompositeLocale
): Partial<DevicesButtonStrings> | undefined => {
  if (!permissions.cameraButton && !permissions.microphoneButton) {
    return { label: locale.component.strings.microphoneButton.speakerMenuTitle };
  }
  return undefined;
};
