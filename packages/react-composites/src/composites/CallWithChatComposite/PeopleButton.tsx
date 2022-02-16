// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ControlBarButton, ControlBarButtonProps } from '@internal/react-components';
import { People20Regular } from '@fluentui/react-icons';

const icon = (): JSX.Element => <People20Regular key={'peopleOffIconKey'} primaryFill="currentColor" />;

/**
 * @private
 */
export const PeopleButton = (props: ControlBarButtonProps): JSX.Element => {
  const strings = { label: props.label, ...props.strings };

  return (
    <ControlBarButton
      {...props}
      strings={strings}
      labelKey={'peopleButtonLabelKey'}
      onRenderOnIcon={props.onRenderOnIcon ?? icon}
      onRenderOffIcon={props.onRenderOffIcon ?? icon}
      onClick={props.onClick}
    />
  );
};
