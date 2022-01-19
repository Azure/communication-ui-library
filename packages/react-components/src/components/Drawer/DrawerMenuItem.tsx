// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IIconProps, mergeStyles, Stack } from '@fluentui/react';
import React from 'react';
import { BaseCustomStyles } from '../../types';

/**
 * Props for the DrawerMenuItem
 *
 * @private
 */
export interface DrawerMenuItemProps {
  onItemClick?: (key: string) => void;
  key: string;
  text?: string;
  iconProps?: IIconProps;
  subMenuProps?: DrawerMenuItemProps;
  styles: BaseCustomStyles;
}

/**
 * Maps the individual item in menuProps.items passed in the {@link DrawerMenu} into a UI component.
 *
 * @private
 */
export const DrawerMenuItem = (props: DrawerMenuItemProps): JSX.Element => {
  const rootStyles = mergeStyles(drawerMenuItemRootStyles, props.styles?.root);

  return (
    // A11y TODO: Ensure root element, and only the root element, is focusable
    <Stack
      horizontal
      className={rootStyles}
      tokens={{ childrenGap: '0.9rem' }}
      onClick={() => props.onItemClick && props.onItemClick(props.key)}
    >
      <Stack.Item>
        <Speaker220Regular primaryFill="currentColor" />
      </Stack.Item>
      <Stack.Item grow>{props.text}</Stack.Item>
      {props.subMenuProps && (
        <Stack.Item>
          <ChevronRight20Regular primaryFill="currentColor" />
        </Stack.Item>
      )}
    </Stack>
  );
};

const drawerMenuItemRootStyles = {
  padding: '0.9rem',
  cursor: 'pointer',
  ':hover': {
    background: '#EDEBE9' // TODO use useTheme...
  }
};
