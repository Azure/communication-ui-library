// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStyles, useTheme } from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { _usePermissions } from '@internal/react-components';
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

  /* @conditional-compile-remove(rooms) */
  let disabled = props.disabled;
  /* @conditional-compile-remove(rooms) */
  const permissions = _usePermissions();
  /* @conditional-compile-remove(rooms) */
  disabled = disabled || !permissions.participantList;

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
      /* @conditional-compile-remove(rooms) */
      disabled={disabled}
    />
  );
};
