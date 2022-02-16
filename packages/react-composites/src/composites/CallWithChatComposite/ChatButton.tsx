// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { ControlBarButton, ControlBarButtonProps } from '@internal/react-components';
import { Chat20Filled, Chat20Regular } from '@fluentui/react-icons';

const filledIcon = (): JSX.Element => <Chat20Filled key={'chatOnIconKey'} primaryFill="currentColor" />;
const regularIcon = (): JSX.Element => <Chat20Regular key={'chatOffIconKey'} primaryFill="currentColor" />;

/**
 * @private
 */
export const ChatButton = (props: ControlBarButtonProps): JSX.Element => {
  const strings = { label: props.label, ...props.strings };
  const defaultIcon = useMemo(() => (props.showLabel ? regularIcon : filledIcon), [props.showLabel]);
  return (
    <ControlBarButton
      {...props}
      labelKey={'chatButtonLabelKey'}
      strings={strings}
      onRenderOnIcon={props.onRenderOnIcon ?? defaultIcon}
      onRenderOffIcon={props.onRenderOffIcon ?? defaultIcon}
      onClick={props.onClick}
    />
  );
};
