// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createContext, useContextSelector } from '@fluentui/react-context-selector';
import type { ContextSelector } from '@fluentui/react-context-selector';
import { DeviceMenuItemRadioContextValue } from './DeviceMenuItemRadioContext.types';

const deviceMenuItemRadioContext = createContext<DeviceMenuItemRadioContextValue | undefined>(undefined);

const deviceMenuItemRadioContextDefaultValue: DeviceMenuItemRadioContextValue = {
  device: {
    id: '',
    name: ''
  },
  icon: undefined
};

/** @private */
export const DeviceMenuItemRadioContextProvider = deviceMenuItemRadioContext.Provider;

/** @private */
export const useDeviceMenuItemRadioContext = <T>(selector: ContextSelector<DeviceMenuItemRadioContextValue, T>): T =>
  useContextSelector(deviceMenuItemRadioContext, (ctx = deviceMenuItemRadioContextDefaultValue) => selector(ctx));
