// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useMemo } from 'react';
import { CallCompositeIcon } from '../icons';
import { ControlBarButton, ControlBarButtonStrings } from '@internal/react-components';
import { ControlBarButtonProps, ControlBarButtonStyles } from '@internal/react-components';
import { concatStyleSets, useTheme } from '@fluentui/react';
import { CallControlDisplayType } from '../types/CommonCallControlOptions';
import { useLocale } from '../../localization';

const icon = (): JSX.Element => <CallCompositeIcon iconName={'DtmfDialpadButton'} />;

/**
 * @private
 */
export interface DtmfDialerButtonProps extends ControlBarButtonProps {
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
}
/**
 * Button for showing and hiding the dtmf dialer in the Call composite.
 * To be used only if the more button control is disabled. This button will replace
 * it in the control bar unless it is also disabled.
 * @private
 */
export const DtmfDialpadButton = (props: DtmfDialerButtonProps): JSX.Element => {
  const { strings, onRenderOnIcon, onRenderOffIcon, onClick, displayType } = props;
  const theme = useTheme();
  const locale = useLocale();
  const dialpadButtonStrings: ControlBarButtonStrings = {
    label: locale.strings.call.dtmfDialerButtonLabel,
    tooltipOnContent: locale.strings.call.dtmfDialerButtonTooltipOn,
    tooltipOffContent: locale.strings.call.dtmfDialerButtonTooltipOff
  };
  const styles: ControlBarButtonStyles = useMemo(
    () =>
      concatStyleSets(
        {
          rootChecked: {
            background: theme.palette.neutralLight
          }
        },
        props.styles ?? {}
      ),
    [props.styles, theme.palette.neutralLight]
  );
  return (
    <ControlBarButton
      {...props}
      strings={strings ? strings : dialpadButtonStrings}
      showLabel={displayType !== 'compact'}
      labelKey={'dtmfDialpadButtonLabelKey'}
      onRenderOnIcon={onRenderOnIcon ?? icon}
      onRenderOffIcon={onRenderOffIcon ?? icon}
      onClick={onClick}
      styles={styles}
    />
  );
};
