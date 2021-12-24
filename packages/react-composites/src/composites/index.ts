// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type { Disposable, AdapterState } from './common/adapters';

export * from './ChatComposite';
export * from './CallComposite';
export type { AvatarPersonaData, AvatarPersonaDataCallback } from './common/AvatarPersona';
export * from './common/icons';
export * from './localization/locales';
export type { CompositeStrings, CompositeLocale } from './localization';
export type { AdapterError, AdapterErrors } from './common/adapters';
export type { SingletonProviderProps } from './common/SingletonProvider';
/* @conditional-compile-remove-from(stable) */
export * from './MeetingComposite';
/* @conditional-compile-remove-from(stable) */
export { createAzureCommunicationMeetingAdapter } from './MeetingComposite';
