// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './components';
export { IdentifierProvider } from './identifiers';
export type { Identifiers, IdentifierProviderProps } from './identifiers';
export * from './localization/locales';
export { LocalizationProvider } from './localization';
export type { ComponentStrings, ComponentLocale, LocalizationProviderProps } from './localization';
export * from './theming';

export type {
  BaseCustomStylesProps,
  ButtonCustomStylesProps,
  CallParticipant,
  ChatMessage,
  CommunicationParticipant,
  ContentSystemMessage,
  CustomAvatarOptions,
  CustomMessage,
  Message,
  MessageAttachedStatus,
  MessageCommon,
  MessageContentType,
  MessageType,
  OnRenderAvatarCallback,
  ParticipantAddedSystemMessage,
  ParticipantRemovedSystemMessage,
  SystemMessage,
  SystemMessageCommon,
  SystemMessageType,
  TopicUpdatedSystemMessage,
  VideoGalleryLocalParticipant,
  VideoGalleryParticipant,
  VideoGalleryRemoteParticipant,
  VideoGalleryStream,
  VideoStreamOptions
} from './types';
