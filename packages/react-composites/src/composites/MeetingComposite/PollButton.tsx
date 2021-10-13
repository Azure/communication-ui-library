// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ControlBarButton, ControlBarButtonProps } from '@internal/react-components';
import { Poll20Filled, Poll20Regular } from '@fluentui/react-icons';

const onRenderOnIcon = (): JSX.Element => <Poll20Filled key={'giftOnIconKey'} primaryFill="currentColor" />;
const onRenderOffIcon = (): JSX.Element => <Poll20Regular key={'giftOffIconKey'} primaryFill="currentColor" />;

/**
 * @private
 */
export const PollButton = (props: ControlBarButtonProps): JSX.Element => {
  const strings = { label: 'Poll', ...props.strings };

  return (
    <ControlBarButton
      {...props}
      strings={strings}
      labelKey={'pollButtonLabelKey'}
      onRenderOnIcon={props.onRenderOnIcon ?? onRenderOnIcon}
      onRenderOffIcon={props.onRenderOffIcon ?? onRenderOffIcon}
      onClick={props.onClick}
    />
  );
};
