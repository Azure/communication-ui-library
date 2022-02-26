// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type { Disposable, AdapterState } from './common/adapters';

export * from './ChatComposite';
export * from './CallComposite';
export type { AvatarPersonaData, AvatarPersonaDataCallback } from './common/AvatarPersona';
export { COMPOSITE_ONLY_ICONS, DEFAULT_COMPOSITE_ICONS } from './common/icons';
export type { CompositeIcons, ChatCompositeIcons, CallCompositeIcons } from './common/icons';
/* @conditional-compile-remove(call-with-chat-composite) */
export type { CallWithChatCompositeIcons } from './common/icons';
export * from './localization/locales';
export type { CompositeStrings, CompositeLocale } from './localization';
export type { AdapterError, AdapterErrors } from './common/adapters';
export type { BaseCompositeProps } from './common/BaseComposite';
/* @conditional-compile-remove(call-with-chat-composite) */
export * from './CallWithChatComposite';
/* @conditional-compile-remove(call-with-chat-composite) */
export { createAzureCommunicationCallWithChatAdapter } from './CallWithChatComposite';
