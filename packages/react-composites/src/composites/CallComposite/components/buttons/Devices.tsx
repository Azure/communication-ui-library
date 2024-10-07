// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ControlBarButtonStyles, DevicesButton } from '@internal/react-components';
import { DevicesButtonStrings } from '@internal/react-components';
import React, { useMemo } from 'react';
import { usePropsFor } from '../../hooks/usePropsFor';
import { concatButtonBaseStyles, devicesButtonWithIncreasedTouchTargets } from '../../styles/Buttons.styles';
import { CompositeLocale, useLocale } from '../../../localization';
import { _HighContrastAwareIcon } from '@internal/react-components';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { ParticipantRole } from '@azure/communication-calling';
import { useSelector } from '../../hooks/useSelector';
import { getRole } from '../../selectors/baseSelectors';

/** @private */
export const Devices = (props: {
  displayType?: CallControlDisplayType;
  increaseFlyoutItemSize?: boolean;
  styles?: ControlBarButtonStyles;
  disabled?: boolean;
}): JSX.Element => {
  const devicesButtonProps = usePropsFor(DevicesButton);
  const role: ParticipantRole = useSelector(getRole) ?? 'Unknown';

  const augmentedDeviceButtonProps = useMemo(
    () => ({
      ...devicesButtonProps,
      microphones: role === 'Consumer' ? [] : devicesButtonProps.microphones,
      cameras: role === 'Consumer' ? [] : devicesButtonProps.cameras
    }),
    [devicesButtonProps, role]
  );
  const styles = useMemo(
    () =>
      concatButtonBaseStyles(
        props.increaseFlyoutItemSize ? devicesButtonWithIncreasedTouchTargets : {},
        props.styles ?? {}
      ),
    [props.increaseFlyoutItemSize, props.styles]
  );
  const locale = useLocale();
  const onlyManageSpeakers = role === 'Consumer';

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
      strings={getLabelFromRole(role as ParticipantRole, locale)}
      onRenderIcon={onlyManageSpeakers ? onRenderDevicesIcon : undefined}
    />
  );
};

const getLabelFromRole = (
  role: ParticipantRole,
  locale: CompositeLocale
): Partial<DevicesButtonStrings> | undefined => {
  if (role === 'Consumer') {
    return { label: locale.component.strings.microphoneButton.speakerMenuTitle };
  }
  return undefined;
};
