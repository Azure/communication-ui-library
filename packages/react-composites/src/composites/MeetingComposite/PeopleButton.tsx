// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ControlBarButton, ControlBarButtonProps } from '@internal/react-components';
import { People20Filled, People20Regular } from '@fluentui/react-icons';

const onRenderOnIcon = (): JSX.Element => <People20Filled key={'peopleOnIconKey'} primaryFill="currentColor" />;
const onRenderOffIcon = (): JSX.Element => <People20Regular key={'peopleOffIconKey'} primaryFill="currentColor" />;

/**
 * @private
 */
export const PeopleButton = (props: ControlBarButtonProps): JSX.Element => {
  const strings = { label: 'People', ...props.strings };

  return (
    <ControlBarButton
      {...props}
      strings={strings}
      labelKey={'peopleButtonLabelKey'}
      onRenderOnIcon={props.onRenderOnIcon ?? onRenderOnIcon}
      onRenderOffIcon={props.onRenderOffIcon ?? onRenderOffIcon}
      onClick={props.onClick}
    />
  );
};
