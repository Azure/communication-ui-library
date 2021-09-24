// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './components';
export { _IdentifierProvider } from './identifiers';
export type { _Identifiers as Identifiers, IdentifierProviderProps } from './identifiers';
export * from './localization/locales';
export { LocalizationProvider } from './localization';
export type { ComponentStrings, ComponentLocale, LocalizationProviderProps } from './localization';
export * from './theming';

export type {
  BaseCustomStylesProps,
  ButtonCustomStylesProps,
  ChatMessage,
  ChatMessagePayload,
  OmitNever,
  AllKeys,
  SystemMessageType,
  CustomMessage,
  CustomMessagePayload,
  Message,
  MessageAttachedStatus,
  MessageContentType,
  MessageType as MessageTypes,
  SystemMessage,
  SystemMessagePayloadAllProps,
  SystemMessagePayload,
  CommunicationParticipant,
  CallParticipant,
  VideoStreamOptions,
  VideoGalleryParticipant,
  VideoGalleryStream,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  OnRenderAvatarCallback,
  CustomAvatarOptions
} from './types';
