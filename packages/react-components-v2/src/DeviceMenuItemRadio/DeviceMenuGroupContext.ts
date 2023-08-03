// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createContext, useContextSelector } from '@fluentui/react-context-selector';
import type { ContextSelector } from '@fluentui/react-context-selector';
import { DeviceMenuGroupContextValue } from './DeviceMenuGroupContext.types';

const deviceMenuGroupContext = createContext<DeviceMenuGroupContextValue | undefined>(undefined);

const deviceMenuGroupContextDefaultValue: DeviceMenuGroupContextValue = {
  selectedDeviceId: '',
  radioGroupName: '',
  onDeviceSelected: () => undefined
};

/** @private */
export const DeviceMenuGroupContextProvider = deviceMenuGroupContext.Provider;

/** @private */
export const useDeviceMenuGroupContext = <T>(selector: ContextSelector<DeviceMenuGroupContextValue, T>): T =>
  useContextSelector(deviceMenuGroupContext, (ctx = deviceMenuGroupContextDefaultValue) => selector(ctx));
