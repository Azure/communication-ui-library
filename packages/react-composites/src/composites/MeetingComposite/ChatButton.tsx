// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ControlBarButton, ControlBarButtonProps } from '@internal/react-components';
import { Chat20Filled, Chat20Regular } from '@fluentui/react-icons';

const onRenderOnIcon = (): JSX.Element => <Chat20Filled key={'chatOnIconKey'} primaryFill="currentColor" />;
const onRenderOffIcon = (): JSX.Element => <Chat20Regular key={'chatOffIconKey'} primaryFill="currentColor" />;

/**
 * @private
 */
export const ChatButton = (props: ControlBarButtonProps): JSX.Element => {
  const strings = { label: 'Chat', ...props.strings };

  return (
    <ControlBarButton
      {...props}
      labelKey={'chatButtonLabelKey'}
      strings={strings}
      onRenderOnIcon={props.onRenderOnIcon ?? onRenderOnIcon}
      onRenderOffIcon={props.onRenderOffIcon ?? onRenderOffIcon}
      onClick={props.onClick}
    />
  );
};
