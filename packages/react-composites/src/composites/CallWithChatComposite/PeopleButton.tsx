// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStyles, useTheme } from '@internal/react-components';
import { concatStyleSets } from '@fluentui/react';
import { CallWithChatCompositeIcon } from '../common/icons';

const icon = (): JSX.Element => <CallWithChatCompositeIcon iconName={'ControlBarPeopleButton'} />;

/**
 * @private
 */
export const PeopleButton = (props: ControlBarButtonProps): JSX.Element => {
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
    [theme]
  );

  return (
    <ControlBarButton
      {...props}
      strings={strings}
      labelKey={'peopleButtonLabelKey'}
      onRenderOnIcon={props.onRenderOnIcon ?? icon}
      onRenderOffIcon={props.onRenderOffIcon ?? icon}
      onClick={props.onClick}
      styles={styles}
    />
  );
};
