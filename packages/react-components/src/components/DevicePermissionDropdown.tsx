// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Dropdown, IDropdownOption, IDropdownStyles, Stack, Text } from '@fluentui/react';
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
   * Ask for permissions of devices.
   *
   * @remarks
   * Browser permission window will pop up if permissions are not granted yet
   *
   * @param constrain - Define constraints for accessing local devices {@link @azure/communication-calling#PermissionConstraints }
   */
  askDevicePermission?(constrain: PermissionConstraints): Promise<void>;
  /**
   * Define constraints for accessing local devices  {@link @azure/communication-calling#PermissionConstraints }
   */
  constrain?: PermissionConstraints;
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
  const { icon, askDevicePermission, constrain, strings, options, styles } = props;

  const onRenderPlaceholder = (): JSX.Element => {
    return (
      <Stack horizontal verticalAlign="center">
        {icon}
        <Text>{strings?.placeHolderText}</Text>
      </Stack>
    );
  };

  const onRenderCaretDown = (): JSX.Element => {
    return <Text>{strings?.actionButtonContent}</Text>;
  };

  return (
    <Dropdown
      placeholder={strings?.placeHolderText}
      label={strings?.label}
      onRenderPlaceholder={onRenderPlaceholder}
      onRenderCaretDown={onRenderCaretDown}
      onClick={() => {
        if (askDevicePermission) {
          askDevicePermission(constrain ?? { video: true, audio: true });
        }
      }}
      options={options ?? []}
      styles={styles}
    />
  );
};

/**
 * Define constraints for accessing local devices  {@link @azure/communication-calling#PermissionConstraints }
 *
 * @internal
 */
export type PermissionConstraints = {
  audio: boolean;
  video: boolean;
};
