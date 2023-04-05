// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
      data-ui-id={'common-call-composite-more-button'}
    />
  );
};
