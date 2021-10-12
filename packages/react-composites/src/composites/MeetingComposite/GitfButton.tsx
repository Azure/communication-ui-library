// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ControlBarButton, ControlBarButtonProps } from '@internal/react-components';
import { Gift20Filled, Gift20Regular } from '@fluentui/react-icons';

const onRenderOnIcon = (): JSX.Element => <Gift20Filled key={'giftOnIconKey'} primaryFill="currentColor" />;
const onRenderOffIcon = (): JSX.Element => <Gift20Regular key={'giftOffIconKey'} primaryFill="currentColor" />;

/**
 * @private
 */
export const GiftButton = (props: ControlBarButtonProps): JSX.Element => {
  const strings = { label: 'Surprise me', ...props.strings };

  return (
    <ControlBarButton
      {...props}
      strings={strings}
      labelKey={'giftButtonLabelKey'}
      onRenderOnIcon={props.onRenderOnIcon ?? onRenderOnIcon}
      onRenderOffIcon={props.onRenderOffIcon ?? onRenderOffIcon}
      onClick={props.onClick}
    />
  );
};
