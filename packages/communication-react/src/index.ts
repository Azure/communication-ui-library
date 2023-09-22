// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * `@azure/communication-react` is an npm package that exports the functionality of the Azure Communication Services - UI Library.
 *
 * This package makes it easy for you to build modern communications user experiences using Azure Communication Services. It gives you a library of production-ready UI components that you can drop into your applications:
 *   - Composites: These components are turn-key solutions that implement common communication scenarios. You can quickly add video calling or chat experiences to your applications. Composites are open-source higher order components built using UI components.
 *   - UI Components - These components are open-source building blocks that let you build custom communications experience. Components are offered for both calling and chat capabilities that can be combined to build experiences.
 *
 * These UI client libraries all use Microsoft's Fluent design language and assets. Fluent UI provides a foundational layer for the UI Library and is actively used across Microsoft products.
 *
 * In conjunction with the UI components, the UI Library exposes a stateful client library for calling and chat. This client is agnostic to any specific state management framework and can be integrated with common state managers like Redux or React Context.
 * This stateful client library can be used with the UI Components to pass props and methods for the UI Components to render data. For more information, see Stateful Client Overview.
 *
 * For more information visit: https://aka.ms/acsstorybook
 *
 * @packageDocumentation
 */

export { fromFlatCommunicationIdentifier, toFlatCommunicationIdentifier } from '../../acs-ui-common/src';
export type {
  AreEqual,
  CommonProperties,
  MessageStatus,
  Common,
  AreTypeEqual,
  AreParamEqual
} from '../../acs-ui-common/src';

// Not to export chat/calling specific hook from binding package
export type {
  CallClientProviderProps,
  CallAgentProviderProps,
  CallProviderProps,
  GetCallingSelector,
  CallingHandlers,
  CallingBaseSelectorProps,
  CommonCallingHandlers
} from '../../calling-component-bindings/src';

/* @conditional-compile-remove(video-background-effects) */
export type { VideoBackgroundEffectsDependency, CallingHandlersOptions } from '../../calling-component-bindings/src';

/* @conditional-compile-remove(close-captions) */
export type { CaptionsOptions } from '../../calling-component-bindings/src';

export type {
  ChatClientProviderProps,
  ChatThreadClientProviderProps,
  GetChatSelector,
  ChatHandlers,
  ChatBaseSelectorProps
} from '../../chat-component-bindings/src';

export {
  CallClientProvider,
  CallAgentProvider,
  CallProvider,
  useCallClient,
  useCallAgent,
  useCall,
  useDeviceManager,
  getCallingSelector,
  createDefaultCallingHandlers
} from '../../calling-component-bindings/src';

/* @conditional-compile-remove(teams-identity-support) */
export {
  useTeamsCallAgent,
  useTeamsCall,
  createDefaultTeamsCallingHandlers
} from '../../calling-component-bindings/src';

/* @conditional-compile-remove(teams-identity-support) */
export type { TeamsCallingHandlers } from '../../calling-component-bindings/src';

export type {
  ScreenShareButtonSelector,
  CameraButtonSelector,
  VideoGallerySelector,
  DevicesButtonSelector,
  EmptySelector,
  ErrorBarSelector as CallErrorBarSelector,
  ParticipantListSelector,
  MicrophoneButtonSelector,
  ParticipantsButtonSelector,
  CreateDefaultCallingHandlers
} from '../../calling-component-bindings/src';
/* @conditional-compile-remove(PSTN-calls) */
export type { HoldButtonSelector } from '../../calling-component-bindings/src';

/* @conditional-compile-remove(raise-hand) */
export type { RaiseHandButtonSelector } from '../../calling-component-bindings/src';

export {
  ChatClientProvider,
  ChatThreadClientProvider,
  useChatClient,
  useChatThreadClient,
  getChatSelector,
  createDefaultChatHandlers
} from '../../chat-component-bindings/src';

export type {
  MessageThreadSelector,
  TypingIndicatorSelector,
  ChatParticipantListSelector,
  SendBoxSelector,
  ErrorBarSelector as ChatErrorBarSelector
} from '../../chat-component-bindings/src';

export {
  _IdentifierProvider,
  CameraButton,
  ControlBar,
  ControlBarButton,
  DevicesButton,
  EndCallButton,
  ErrorBar,
  GridLayout,
  LocalizationProvider,
  MessageStatusIndicator,
  MessageThread,
  MicrophoneButton,
  ParticipantItem,
  ParticipantList,
  ParticipantsButton,
  ScreenShareButton,
  SendBox,
  StreamMedia,
  TypingIndicator,
  VideoGallery,
  VideoTile
} from '../../react-components/src';
/* @conditional-compile-remove(image-gallery) */
export { ImageGallery } from '../../react-components/src';
/* @conditional-compile-remove(PSTN-calls) */
export { HoldButton } from '../../react-components/src';

/* @conditional-compile-remove(raise-hand) */
export { RaiseHandButton } from '../../react-components/src';

/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
export { Dialpad } from '../../react-components/src';

/* @conditional-compile-remove(call-readiness) */
export {
  CameraAndMicrophoneSitePermissions,
  MicrophoneSitePermissions,
  CameraSitePermissions
} from '../../react-components/src';
/* @conditional-compile-remove(call-readiness) */
export type {
  CameraAndMicrophoneSitePermissionsStrings,
  CameraAndMicrophoneSitePermissionsProps,
  CameraSitePermissionsStrings,
  CameraSitePermissionsProps,
  CommonSitePermissionsProps,
  SitePermissionsStrings,
  SitePermissionsStyles,
  MicrophoneSitePermissionsStrings,
  MicrophoneSitePermissionsProps
} from '../../react-components/src';

/* @conditional-compile-remove(total-participant-count) */
export type { ParticipantListStrings } from '../../react-components/src';

/* @conditional-compile-remove(mention) */
export type {
  MentionOptions,
  MentionDisplayOptions,
  MentionLookupOptions,
  Mention,
  MentionPopoverStrings
} from '../../react-components/src';

export type {
  _IdentifierProviderProps,
  _Identifiers,
  ActiveErrorMessage,
  BaseCustomStyles,
  CallParticipantListParticipant,
  CameraButtonContextualMenuStyles,
  CameraButtonProps,
  CameraButtonStrings,
  CameraButtonStyles,
  ChatMessage,
  CommunicationParticipant,
  ComponentLocale,
  ComponentSlotStyle,
  ComponentStrings,
  ContentSystemMessage,
  ControlBarButtonProps,
  ControlBarButtonStrings,
  ControlBarButtonStyles,
  ControlBarLayout,
  ControlBarProps,
  CreateVideoStreamViewResult,
  CustomAvatarOptions,
  CustomMessage,
  DevicesButtonContextualMenuStyles,
  DevicesButtonProps,
  DevicesButtonStrings,
  DevicesButtonStyles,
  EndCallButtonProps,
  EndCallButtonStrings,
  ErrorBarProps,
  ErrorBarStrings,
  ErrorType,
  GridLayoutProps,
  GridLayoutStyles,
  HorizontalGalleryStyles,
  JumpToNewMessageButtonProps,
  LocalizationProviderProps,
  LocalVideoCameraCycleButtonProps,
  LoadingState,
  Message,
  MessageAttachedStatus,
  MessageCommon,
  MessageContentType,
  MessageProps,
  MessageRenderer,
  MessageStatusIndicatorProps,
  MessageStatusIndicatorStrings,
  MessageThreadProps,
  MessageThreadStrings,
  MessageThreadStyles,
  MicrophoneButtonContextualMenuStyles,
  MicrophoneButtonProps,
  MicrophoneButtonStrings,
  MicrophoneButtonStyles,
  OnRenderAvatarCallback,
  OptionsDevice,
  ParticipantAddedSystemMessage,
  ParticipantItemProps,
  ParticipantItemStrings,
  ParticipantItemStyles,
  ParticipantListItemStyles,
  ParticipantListParticipant,
  ParticipantListProps,
  ParticipantListStyles,
  ParticipantMenuItemsCallback,
  ParticipantRemovedSystemMessage,
  ParticipantState,
  ParticipantsButtonContextualMenuStyles,
  ParticipantsButtonProps,
  ParticipantsButtonStrings,
  ParticipantsButtonStyles,
  ReadReceiptsBySenderId,
  ScreenShareButtonProps,
  ScreenShareButtonStrings,
  SendBoxProps,
  SendBoxStrings,
  SendBoxStylesProps,
  StreamMediaProps,
  SystemMessage,
  SystemMessageCommon,
  TopicUpdatedSystemMessage,
  TypingIndicatorProps,
  TypingIndicatorStrings,
  TypingIndicatorStylesProps,
  UpdateMessageCallback,
  CancelEditCallback,
  VideoGalleryLayout,
  VideoGalleryLocalParticipant,
  VideoGalleryParticipant,
  VideoGalleryProps,
  VideoGalleryRemoteParticipant,
  VideoGalleryStream,
  VideoGalleryStrings,
  VideoGalleryStyles,
  VideoStreamOptions,
  VideoTileProps,
  VideoTileStylesProps,
  ViewScalingMode
} from '../../react-components/src';
/* @conditional-compile-remove(raise-hand) */
export type { RaiseHandButtonProps, RaiseHandButtonStrings, RaisedHand } from '../../react-components/src';
/* @conditional-compile-remove(image-gallery) */
export type { ImageGalleryProps, ImageGalleryImageProps, ImageGalleryStrings } from '../../react-components/src';
/* @conditional-compile-remove(data-loss-prevention) */
export type { BlockedMessage } from '../../react-components/src';
/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
export type { DialpadProps, DialpadStrings, DialpadStyles, DtmfTone } from '../../react-components/src';
/* @conditional-compile-remove(file-sharing) */
export type {
  ActiveFileUpload,
  SendBoxErrorBarError,
  FileDownloadHandler,
  FileDownloadError
} from '../../react-components/src';
/* @conditional-compile-remove(file-sharing) */ /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
export type { FileMetadata } from '../../react-components/src';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
export type {
  BaseFileMetadata,
  FileMetadataAttachmentType,
  AttachmentDownloadResult,
  FileSharingMetadata,
  ImageFileMetadata
} from '../../react-components/src';
/* @conditional-compile-remove(PSTN-calls) */
export type { HoldButtonProps, HoldButtonStrings, VideoTileStrings } from '../../react-components/src';
/* @conditional-compile-remove(call-readiness) */
export type { BrowserPermissionDeniedStrings, BrowserPermissionDeniedProps } from '../../react-components/src';
/* @conditional-compile-remove(call-readiness) */
export type {
  BrowserPermissionDeniedIOSStrings,
  BrowserPermissionDeniedStyles,
  BrowserPermissionDeniedIOSProps
} from '../../react-components/src';
/* @conditional-compile-remove(pinned-participants) */
export type { VideoTileContextualMenuProps, VideoTileDrawerMenuProps } from '../../react-components/src';
/* @conditional-compile-remove(vertical-gallery) */
export type { OverflowGalleryPosition } from '../../react-components/src';
/* @conditional-compile-remove(click-to-call) */ /* @conditional-compile-remove(rooms) */
export type { LocalVideoTileSize } from '../../react-components/src';
export * from '../../react-components/src/localization/locales';
export * from '../../react-components/src/theming';
export * from '../../calling-stateful-client/src/index-public';
/* @conditional-compile-remove(one-to-n-calling) */
export type { DeclarativeCallAgent } from '../../calling-stateful-client/src';
export { createStatefulChatClient } from '../../chat-stateful-client/src';
export type {
  StatefulChatClient,
  StatefulChatClientArgs,
  StatefulChatClientOptions,
  ChatMessageWithStatus,
  ChatClientState,
  ChatError,
  ChatErrors,
  ChatThreadClientState,
  ChatThreadProperties,
  ChatErrorTarget
} from '../../chat-stateful-client/src';
export * from '../../react-composites/src/index-public';
export * from './mergedHooks';

/* @conditional-compile-remove(unsupported-browser) */
export { UnsupportedBrowser } from '../../react-components/src';
/* @conditional-compile-remove(unsupported-browser) */
export type { UnsupportedBrowserStrings, UnsupportedBrowserProps } from '../../react-components/src';
/* @conditional-compile-remove(unsupported-browser) */
export { UnsupportedBrowserVersion } from '../../react-components/src';
/* @conditional-compile-remove(unsupported-browser) */
export type { UnsupportedBrowserVersionStrings, UnsupportedBrowserVersionProps } from '../../react-components/src';
/* @conditional-compile-remove(unsupported-browser) */
export { UnsupportedOperatingSystem } from '../../react-components/src';
/* @conditional-compile-remove(unsupported-browser) */
export type { UnsupportedOperatingSystemStrings, UnsupportedOperatingSystemProps } from '../../react-components/src';
/* @conditional-compile-remove(vertical-gallery) */
export type {
  VerticalGalleryStyles,
  VerticalGalleryStrings,
  VerticalGalleryControlBarStyles
} from '../../react-components/src';
/* @conditional-compile-remove(close-captions) */
export type { SpokenLanguageStrings, CaptionLanguageStrings } from '../../react-components/src';
 /* @conditional-compile-remove(end-of-call-survey) */
export type {CallIssuesToTags}from '../../react-components/src';
