// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { ControlBarButton, ControlBarButtonProps } from '@internal/react-components';
import { MoreHorizontal20Filled } from '@fluentui/react-icons';

const icon = (): JSX.Element => <MoreHorizontal20Filled key={'chatOnIconKey'} primaryFill="currentColor" />;

/**
 * @private
 */
export const MoreButton = (props: ControlBarButtonProps): JSX.Element => {
  return (
    <ControlBarButton
      {...props}
      labelKey={'optionsButtonLabelKey'}
      showLabel={props.showLabel}
      onRenderOnIcon={icon}
      onRenderOffIcon={icon}
      onClick={props.onClick}
      data-ui-id={props['data-ui-id' as keyof ControlBarButtonProps]}
    />
  );
};
