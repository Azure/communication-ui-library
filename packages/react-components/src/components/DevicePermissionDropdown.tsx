// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Dropdown, IDropdownOption, IDropdownStyles, Stack } from '@fluentui/react';
import React from 'react';

/**
 * Strings of {@link DevicePermissionDropdown} that can be overridden.
 *
 * @internal
 */
export interface _DevicePermissionDropdownStrings {
  /**
   * dropdown label
   */
  label?: string;
  /**
   * dropdown placeholder
   */
  placeHolderText: string;
  /** string for action button  */
  actionButtonContent?: string;
}

/**
 * Props for {@link _DevicePermissionDropdown}.
 *
 * @internal
 */
export interface _DevicePermissionDropdownProps {
  /**
   * icon shown in dropdown placeholder
   */
  icon?: JSX.Element;
  /**
   * Dropdown content
   */
  options?: IDropdownOption[];
  /**
   * Function that gets triggered when action button is clicked
   */
  onClickActionButton?: () => Promise<void>;
  /**
   * Strings for devicepermissiondropdown
   */
  strings?: _DevicePermissionDropdownStrings;
  /**
   * Styles for devicepermissiondropdown
   */
  styles?: Partial<IDropdownStyles>;
}

/**
 * A dropdown to trigger device permission prompt
 *
 * @internal
 */
export const _DevicePermissionDropdown = (props: _DevicePermissionDropdownProps): JSX.Element => {
  const { icon, onClickActionButton, strings, options, styles } = props;

  const onRenderPlaceholder = (): JSX.Element => {
    return (
      <Stack horizontal verticalAlign="center">
        {icon}
        <span>{strings?.placeHolderText}</span>
      </Stack>
    );
  };

  const onRenderCaretDown = (): JSX.Element => {
    return <span>{strings?.actionButtonContent}</span>;
  };

  return (
    <Dropdown
      placeholder={strings?.placeHolderText}
      label={strings?.label}
      onRenderPlaceholder={onRenderPlaceholder}
      onRenderCaretDown={onRenderCaretDown}
      onClick={onClickActionButton}
      options={options ?? []}
      styles={styles}
    />
  );
};
