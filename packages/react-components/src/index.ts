// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './components';
export { _IdentifierProvider } from './identifiers';
export type { _Identifiers, _IdentifierProviderProps } from './identifiers';
export * from './localization/locales';
export { LocalizationProvider } from './localization';
export type { ComponentStrings, ComponentLocale, LocalizationProviderProps } from './localization';
export * from './theming';

export type {
  BaseCustomStyles,
  CallParticipantListParticipant,
  ChatMessage,
  CommunicationParticipant,
  ContentSystemMessage,
  CustomAvatarOptions,
  CustomMessage,
  Message,
  MessageAttachedStatus,
  MessageCommon,
  MessageContentType,
  OnRenderAvatarCallback,
  ParticipantAddedSystemMessage,
  ParticipantListParticipant,
  ParticipantRemovedSystemMessage,
  SystemMessage,
  SystemMessageCommon,
  TopicUpdatedSystemMessage,
  VideoGalleryLocalParticipant,
  VideoGalleryParticipant,
  VideoGalleryRemoteParticipant,
  VideoGalleryStream,
  VideoStreamOptions
} from './types';
