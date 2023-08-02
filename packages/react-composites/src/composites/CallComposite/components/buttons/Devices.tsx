// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ControlBarButtonStyles, DevicesButton } from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { DevicesButtonStrings } from '@internal/react-components';
import React, { useMemo } from 'react';
import { usePropsFor } from '../../hooks/usePropsFor';
import { concatButtonBaseStyles, devicesButtonWithIncreasedTouchTargets } from '../../styles/Buttons.styles';
/* @conditional-compile-remove(rooms) */
import { CompositeLocale, useLocale } from '../../../localization';
import { _HighContrastAwareIcon } from '@internal/react-components';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
/* @conditional-compile-remove(rooms) */
import { useAdapter } from '../../adapter/CallAdapterProvider';
/* @conditional-compile-remove(rooms) */
import { ParticipantRole } from '@azure/communication-calling';

/** @private */
export const Devices = (props: {
  displayType?: CallControlDisplayType;
  increaseFlyoutItemSize?: boolean;
  styles?: ControlBarButtonStyles;
  disabled?: boolean;
}): JSX.Element => {
  const devicesButtonProps = usePropsFor(DevicesButton);
  /* @conditional-compile-remove(rooms) */
  const adapter = useAdapter();
  /* @conditional-compile-remove(rooms) */
  const role: ParticipantRole = adapter.getState().call?.role ?? 'Unknown';

  const augmentedDeviceButtonProps = useMemo(
    () => ({
      ...devicesButtonProps,
      /* @conditional-compile-remove(rooms) */
      microphones: role === 'Consumer' ? [] : devicesButtonProps.microphones,
      /* @conditional-compile-remove(rooms) */
      cameras: role === 'Consumer' ? [] : devicesButtonProps.cameras
    }),
    [
      devicesButtonProps,
      /* @conditional-compile-remove(rooms) */
      role
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
  const onlyManageSpeakers = role === 'Consumer';

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
      strings={getLabelFromRole(role as ParticipantRole, locale)}
      /* @conditional-compile-remove(rooms) */
      onRenderIcon={onlyManageSpeakers ? onRenderDevicesIcon : undefined}
    />
  );
};

/* @conditional-compile-remove(rooms) */
const getLabelFromRole = (
  role: ParticipantRole,
  locale: CompositeLocale
): Partial<DevicesButtonStrings> | undefined => {
  if (role === 'Consumer') {
    return { label: locale.component.strings.microphoneButton.speakerMenuTitle };
  }
  return undefined;
};
