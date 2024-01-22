// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import { CallCompositeIcon } from '../icons';
import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStyles } from '@internal/react-components';
import { concatStyleSets, useTheme } from '@fluentui/react';

const icon = (): JSX.Element => <CallCompositeIcon iconName={'DtmfDialpadButton'} />;

/**
 * Button for showing and hiding the dtmf dialer in the Call composite.
 * To be used only if the more button control is disabled. This button will replace
 * it in the control bar unless it is also disabled.
 * @private
 */
export const DtmfDialpadButton = (props: ControlBarButtonProps): JSX.Element => {
  const { strings, onRenderOnIcon, onRenderOffIcon, onClick } = props;
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
      labelKey={'dtmfDialpadButtonLabelKey'}
      onRenderOnIcon={onRenderOnIcon ?? icon}
      onRenderOffIcon={onRenderOffIcon ?? icon}
      onClick={onClick}
      styles={styles}
    />
  );
};
