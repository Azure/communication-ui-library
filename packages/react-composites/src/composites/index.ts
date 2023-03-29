// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type { Disposable, AdapterState } from './common/adapters';

export * from './ChatComposite';
export * from './CallComposite';
export * from './CallWithChatComposite';

export type { CallControlDisplayType, CommonCallControlOptions } from './common/types/CommonCallControlOptions';

export type { AvatarPersonaData, AvatarPersonaDataCallback } from './common/AvatarPersona';
export { COMPOSITE_ONLY_ICONS, DEFAULT_COMPOSITE_ICONS } from './common/icons';
export type {
  CompositeIcons,
  ChatCompositeIcons,
  CallCompositeIcons,
  CallWithChatCompositeIcons
} from './common/icons';
export * from './localization/locales';
export type { CompositeStrings, CompositeLocale } from './localization';
export type { AdapterError, AdapterErrors } from './common/adapters';
export type { BaseCompositeProps } from './common/BaseComposite';

/* @conditional-compile-remove(control-bar-button-injection) */
export type {
  CustomCallControlButtonCallbackArgs,
  CustomControlButtonProps,
  CustomCallControlButtonCallback,
  CustomCallControlButtonProps,
  CustomCallControlButtonPlacement
} from './common/types/CommonCallControlOptions';
