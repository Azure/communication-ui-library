// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(dtmf-dialer) */
import React, { useMemo } from 'react';
/* @conditional-compile-remove(dtmf-dialer) */
import { CallCompositeIcon } from '../icons';
/* @conditional-compile-remove(dtmf-dialer) */
import { ControlBarButton } from '@internal/react-components';
import { ControlBarButtonProps, ControlBarButtonStyles } from '@internal/react-components';
/* @conditional-compile-remove(dtmf-dialer) */
import { concatStyleSets, useTheme } from '@fluentui/react';
import { CallControlDisplayType } from '../types/CommonCallControlOptions';

/* @conditional-compile-remove(dtmf-dialer) */
const icon = (): JSX.Element => <CallCompositeIcon iconName={'DtmfDialpadButton'} />;

/**
 * @private
 */
export interface DtmfDialerButtonProps extends ControlBarButtonProps {
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
}
/* @conditional-compile-remove(dtmf-dialer) */
/**
 * Button for showing and hiding the dtmf dialer in the Call composite.
 * To be used only if the more button control is disabled. This button will replace
 * it in the control bar unless it is also disabled.
 * @private
 */
export const DtmfDialpadButton = (props: DtmfDialerButtonProps): JSX.Element => {
  const { strings, onRenderOnIcon, onRenderOffIcon, onClick, displayType } = props;
  const theme = useTheme();
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
      strings={strings}
      showLabel={displayType !== 'compact'}
      labelKey={'dtmfDialpadButtonLabelKey'}
      onRenderOnIcon={onRenderOnIcon ?? icon}
      onRenderOffIcon={onRenderOffIcon ?? icon}
      onClick={onClick}
      styles={styles}
    />
  );
};
