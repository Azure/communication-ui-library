// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './components';
export { _IdentifierProvider } from './identifiers';
export type { _Identifiers, _IdentifierProviderProps } from './identifiers';
export * from './localization/locales';
export { LocalizationProvider } from './localization';
export type { ComponentStrings, ComponentLocale, LocalizationProviderProps } from './localization';
export * from './theming';

export {
  _PermissionsProvider,
  presenterPermissions,
  consumerPermissions,
  _usePermissions,
  _getPermissions
} from './permissions';
export type { _Permissions, _PermissionsProviderProps, Role } from './permissions';

export type {
  BaseCustomStyles,
  CallParticipantListParticipant,
  ChatMessage,
  CommunicationParticipant,
  ContentSystemMessage,
  CreateVideoStreamViewResult,
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
  ParticipantState,
  ReadReceiptsBySenderId,
  SystemMessage,
  SystemMessageCommon,
  TopicUpdatedSystemMessage,
  VideoGalleryLocalParticipant,
  VideoGalleryParticipant,
  VideoGalleryRemoteParticipant,
  VideoGalleryStream,
  VideoStreamOptions,
  ViewScalingMode
} from './types';
