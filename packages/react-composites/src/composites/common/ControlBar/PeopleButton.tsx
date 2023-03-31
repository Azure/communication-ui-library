// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStyles, useTheme } from '@internal/react-components';
import { concatStyleSets } from '@fluentui/react';
import { CallCompositeIcon } from '../icons';

const icon = (): JSX.Element => <CallCompositeIcon iconName={'ControlBarPeopleButton'} />;

/**
 * @private
 */
export const PeopleButton = (props: ControlBarButtonProps): JSX.Element => {
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
      labelKey={'peopleButtonLabelKey'}
      onRenderOnIcon={onRenderOnIcon ?? icon}
      onRenderOffIcon={onRenderOffIcon ?? icon}
      onClick={onClick}
      styles={styles}
    />
  );
};
