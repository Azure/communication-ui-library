// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @private
 */
export interface ConfigurationpageCameraDropdownProps {
  cameraGrantedDropdown: JSX.Element;
  cameraPermissionGranted: boolean;
}

/**
 * @private
 */
export const ConfigurationpageCameraDropdown = (props: ConfigurationpageCameraDropdownProps): JSX.Element => {
  return props.cameraGrantedDropdown;
};
