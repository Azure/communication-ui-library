// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @private
 */
export interface ConfigurationpageMicDropdownProps {
  micGrantedDropdown: JSX.Element;
  micPermissionGranted: boolean;
}

/**
 * @private
 */
export const ConfigurationpageMicDropdown = (props: ConfigurationpageMicDropdownProps): JSX.Element => {
  return props.micGrantedDropdown;
};
