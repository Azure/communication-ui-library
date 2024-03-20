// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStyles, useTheme } from '@internal/react-components';
import { concatStyleSets } from '@fluentui/react';
import { CallCompositeIcon } from '../../../common/icons';
import { controlButtonBaseStyle } from '../../styles/Buttons.styles';

const icon = (): JSX.Element => <CallCompositeIcon iconName={'ControlButtonParticipants'} />;

/**
 * @private
 */
/** @beta */
export const People = (props: ControlBarButtonProps): JSX.Element => {
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
        props.styles ?? {},
        controlButtonBaseStyle
      ),
    [props.styles, theme.palette.neutralLight]
  );

  return (
    <ControlBarButton
      {...props}
      data-ui-id="call-composite-participants-button"
      strings={strings}
      labelKey={'peopleButtonLabelKey'}
      onRenderOnIcon={onRenderOnIcon ?? icon}
      onRenderOffIcon={onRenderOffIcon ?? icon}
      onClick={onClick}
      styles={styles}
    />
  );
};
