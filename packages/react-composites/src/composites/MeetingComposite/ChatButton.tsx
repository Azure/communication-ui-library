// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ControlBarButton, ControlBarButtonProps } from '@internal/react-components';
import { Chat20Filled, Chat20Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove-from(stable) */
// import { NotificationIcon } from './NotificationIcon';
import { Stack } from '@fluentui/react';

const onRenderOnIcon = (): JSX.Element => <Chat20Filled key={'chatOnIconKey'} primaryFill="currentColor" />;
const onRenderOffIcon = (): JSX.Element => <Chat20Regular key={'chatOffIconKey'} primaryFill="currentColor" />;

/**
 * @private
 */
export const ChatButton = (props: ControlBarButtonProps): JSX.Element => {
  const strings = { label: props.label, ...props.strings };

  return (
    <Stack style={{ position: 'relative' }}>
      <ControlBarButton
        {...props}
        labelKey={'chatButtonLabelKey'}
        strings={strings}
        onRenderOnIcon={props.onRenderOnIcon ?? onRenderOnIcon}
        onRenderOffIcon={props.onRenderOffIcon ?? onRenderOffIcon}
        onClick={props.onClick}
      />
      {
        /* @conditional-compile-remove-from(stable) */
        // numberOfMessages > 0 && <NotificationIcon numberOfMessages={numberOfMessages} />
      }
    </Stack>
  );
};
