// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStyles, useTheme } from '@internal/react-components';
import { concatStyleSets } from '@fluentui/react';

/**
 * @private
 */
export const ChatButton = (props: ControlBarButtonProps): JSX.Element => {
  const strings = { label: props.label, ...props.strings };
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
      labelKey={'chatButtonLabelKey'}
      strings={strings}
      onClick={props.onClick}
      styles={styles}
    />
  );
};
