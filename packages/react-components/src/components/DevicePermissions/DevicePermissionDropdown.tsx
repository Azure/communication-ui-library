// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Dropdown, IDropdownOption, IDropdownStyles, ITextStyles, Stack, Text, mergeStyleSets } from '@fluentui/react';
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
  askDevicePermission?(constrain: _PermissionConstraints): Promise<void>;
  /**
   * Optional callback when component is clicked
   */
  onClick?: () => void;
  /**
   * Define constraints for accessing local devices  {@link @azure/communication-calling#PermissionConstraints }
   */
  constrain?: _PermissionConstraints;
  /**
   * Strings for devicepermissiondropdown
   */
  strings?: _DevicePermissionDropdownStrings;
  /**
   * Styles for devicepermissiondropdown
   */
  styles?: Partial<IDropdownStyles>;
  /**
   * Aria-labelledby for the dropdown
   */
  ariaLabelledby?: string;
}

/**
 * A dropdown to trigger device permission prompt
 *
 * @internal
 */
export const _DevicePermissionDropdown = (props: _DevicePermissionDropdownProps): JSX.Element => {
  const { icon, askDevicePermission, onClick, constrain, strings, options } = props;

  const onRenderPlaceholder = (): JSX.Element => {
    return (
      <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
        {icon}
        <Stack.Item
          styles={{
            root: {
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              flex: 1
            }
          }}
        >
          <Text>{strings?.placeHolderText}</Text>
        </Stack.Item>
        <Stack.Item
          shrink={0}
          styles={{
            root: {
              paddingLeft: '0.5rem'
            }
          }}
        >
          <Text>{strings?.actionButtonContent}</Text>
        </Stack.Item>
      </Stack>
    );
  };

  const showAsAllowPrompt = !options && !!askDevicePermission;
  const styles = mergeStyleSets(
    showAsAllowPrompt
      ? {
          title: {
            paddingRight: '0.625rem'
          }
        }
      : {},
    props.styles
  );

  const click = (): void => {
    if (askDevicePermission) {
      void askDevicePermission(constrain ?? { video: true, audio: true });
    }
    onClick?.();
  };

  return (
    <Dropdown
      role={showAsAllowPrompt ? 'button' : undefined}
      data-ui-id={'permission-dropdown'}
      placeholder={strings?.placeHolderText}
      label={strings?.label}
      aria-labelledby={props.ariaLabelledby}
      onRenderPlaceholder={onRenderPlaceholder}
      onRenderCaretDown={showAsAllowPrompt ? () => <></> : undefined}
      onClick={showAsAllowPrompt ? click : undefined}
      onKeyDown={
        showAsAllowPrompt
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                click();
              }
            }
          : undefined
      }
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
export type _PermissionConstraints = {
  audio: boolean;
  video: boolean;
};
