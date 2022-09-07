// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { CallComposite } from './CallComposite';
export type { CallCompositeOptions, CallCompositeProps } from './CallComposite';
/* @conditional-compile-remove(call-readiness) */
export type { DevicePermissionPrompts } from './CallComposite';
export type { CallControlDisplayType, CallControlOptions } from './types/CallControlOptions';
/* @conditional-compile-remove(control-bar-button-injection) */
export type {
  CustomCallControlButtonPlacement,
  CustomCallControlButtonCallback,
  CustomCallControlButtonCallbackArgs,
  CustomCallControlButtonProps,
  CustomControlButtonProps
} from './types/CallControlOptions';
export * from './adapter';
export * from './Strings';
