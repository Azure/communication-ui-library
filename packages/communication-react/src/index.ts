// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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

export type {
  DeepNoiseSuppressionEffectDependency,
  VideoBackgroundEffectsDependency,
  CallingHandlersOptions
} from '../../calling-component-bindings/src';

export type { CaptionsOptions } from '../../calling-component-bindings/src';

export type {
  ChatClientProviderProps,
  ChatThreadClientProviderProps,
  GetChatSelector,
  ChatHandlers,
  ChatBaseSelectorProps
} from '../../chat-component-bindings/src';

/* @conditional-compile-remove(file-sharing-acs) */
export type { MessageOptions, ChatMessageType } from '../../acs-ui-common/src';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
export type { UploadChatImageResult } from '../../acs-ui-common/src';

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

export {
  useTeamsCallAgent,
  useTeamsCall,
  createDefaultTeamsCallingHandlers
} from '../../calling-component-bindings/src';

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
export type { HoldButtonSelector } from '../../calling-component-bindings/src';

export type { RaiseHandButtonSelector } from '../../calling-component-bindings/src';

export type { NotificationStackSelector } from '../../calling-component-bindings/src';
export type { IncomingCallStackSelector } from '../../calling-component-bindings/src';

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
  VideoTile,
  COMPONENT_LOCALE_EN_GB,
  COMPONENT_LOCALE_AR_SA,
  COMPONENT_LOCALE_CS_CZ,
  COMPONENT_LOCALE_CY_GB,
  COMPONENT_LOCALE_DE_DE,
  COMPONENT_LOCALE_ES_ES,
  COMPONENT_LOCALE_ES_MX,
  COMPONENT_LOCALE_FI_FI,
  COMPONENT_LOCALE_FR_FR,
  COMPONENT_LOCALE_FR_CA,
  COMPONENT_LOCALE_HE_IL,
  COMPONENT_LOCALE_IT_IT,
  COMPONENT_LOCALE_JA_JP,
  COMPONENT_LOCALE_KO_KR,
  COMPONENT_LOCALE_NB_NO,
  COMPONENT_LOCALE_NL_NL,
  COMPONENT_LOCALE_PL_PL,
  COMPONENT_LOCALE_PT_BR,
  COMPONENT_LOCALE_RU_RU,
  COMPONENT_LOCALE_SV_SE,
  COMPONENT_LOCALE_TR_TR,
  COMPONENT_LOCALE_ZH_CN,
  COMPONENT_LOCALE_ZH_TW
} from '../../react-components/src';
export { ImageOverlay } from '../../react-components/src';
export { HoldButton } from '../../react-components/src';

export { RaiseHandButton } from '../../react-components/src';

export { Dialpad } from '../../react-components/src';

export { IncomingCallNotification, IncomingCallStack } from '../../react-components/src';
export type {
  IncomingCallNotificationProps,
  IncomingCallNotificationStrings,
  IncomingCallNotificationStyles,
  IncomingCallStackProps,
  IncomingCallStackCall
} from '../../react-components/src';

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
  ViewScalingMode,
  VideoTileContextualMenuProps,
  VideoTileDrawerMenuProps,
  VideoTilesOptions
} from '../../react-components/src';

/* @conditional-compile-remove(together-mode) */
export type {
  TogetherModeStreamViewResult,
  VideoGalleryTogetherModeStreams,
  VideoGalleryTogetherModeParticipantPosition,
  VideoGalleryTogetherModeSeatingInfo,
  TogetherModeStreamOptions
} from '../../react-components/src';

export type { RaiseHandButtonProps, RaiseHandButtonStrings, RaisedHand } from '../../react-components/src';
export type {
  ReactionButtonStrings,
  Reaction,
  ReactionButtonProps,
  ReactionResources,
  ReactionSprite,
  ReactionButtonReaction
} from '../../react-components/src';

export { ReactionButton } from '../../react-components/src';
/* @conditional-compile-remove(rich-text-editor) */
export { RichTextSendBox } from '../../react-components/src';
/* @conditional-compile-remove(rich-text-editor) */
export type { RichTextSendBoxProps, RichTextSendBoxStrings, RichTextStrings } from '../../react-components/src';
export type { Spotlight } from '../../react-components/src';
export type { ImageOverlayProps, ImageOverlayStrings } from '../../react-components/src';
/* @conditional-compile-remove(data-loss-prevention) */
export type { BlockedMessage } from '../../react-components/src';
export type {
  DialpadMode,
  DialpadProps,
  DialpadStrings,
  DialpadStyles,
  DtmfTone,
  LongPressTrigger
} from '../../react-components/src';
/* @conditional-compile-remove(file-sharing-acs) */
export type { AttachmentOptions } from '../../react-components/src';
/* @conditional-compile-remove(file-sharing-acs) */
export type { SendBoxErrorBarError } from '../../react-components/src';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
export type { SendBoxErrorBarType } from '../../react-components/src';
/* @conditional-compile-remove(file-sharing-acs) */
export type { AttachmentActionHandler } from '../../react-components/src';
/* @conditional-compile-remove(file-sharing-acs) */
export type {
  AttachmentSelectionHandler,
  AttachmentRemovalHandler,
  AttachmentUploadOptions,
  AttachmentUploadTask
} from '../../react-components/src';
export type { AttachmentMetadata } from '../../acs-ui-common/src';

/* @conditional-compile-remove(file-sharing-acs) */
export type { AttachmentMetadataInProgress, AttachmentProgressError } from '../../acs-ui-common/src';

/* @conditional-compile-remove(file-sharing-acs) */
export type { AttachmentMenuAction, AttachmentDownloadOptions } from '../../react-components/src';
/* @conditional-compile-remove(file-sharing-acs) */
export { defaultAttachmentMenuAction } from '../../react-components/src';
export type { ChatAttachmentType } from '../../react-components/src';
export type { InlineImageOptions, InlineImage } from '../../react-components/src';
/* @conditional-compile-remove(rich-text-editor) */
export type { RichTextEditorOptions, RichTextEditBoxOptions } from '../../react-components/src';
export type { HoldButtonProps, HoldButtonStrings } from '../../react-components/src';
export type { VideoTileStrings } from '../../react-components/src';
/* @conditional-compile-remove(call-readiness) */
export type { BrowserPermissionDeniedStrings, BrowserPermissionDeniedProps } from '../../react-components/src';
/* @conditional-compile-remove(call-readiness) */
export type {
  BrowserPermissionDeniedIOSStrings,
  BrowserPermissionDeniedStyles,
  BrowserPermissionDeniedIOSProps
} from '../../react-components/src';
export type { OverflowGalleryPosition } from '../../react-components/src';
export type { LocalVideoTileSize } from '../../react-components/src';
export * from '../../react-components/src/localization/locales';
export * from '../../react-components/src/theming';
export * from '../../calling-stateful-client/src/index-public';
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
/* @conditional-compile-remove(rich-text-editor-image-upload) */
export type { MessagingPolicy } from '../../chat-stateful-client/src';

export type { ResourceFetchResult } from '../../chat-stateful-client/src';
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
export type {
  VerticalGalleryStyles,
  VerticalGalleryStrings,
  VerticalGalleryControlBarStyles
} from '../../react-components/src';

export type { SpokenLanguageStrings, CaptionLanguageStrings } from '../../react-components/src';

export type { SurveyIssues } from '../../react-components/src';

export type { SurveyIssuesHeadingStrings } from '../../react-components/src';

export type { CallSurveyImprovementSuggestions } from '../../react-components/src';

export { NotificationStack, Notification } from '../../react-components/src';

export type {
  NotificationStackProps,
  NotificationProps,
  NotificationStrings,
  NotificationStackStrings,
  NotificationType,
  ActiveNotification,
  NotificationStyles
} from '../../react-components/src';
export type { MeetingConferencePhoneInfoModalStrings } from '../../react-components/src';
/* @conditional-compile-remove(rtt) */
export type { RTTModalStrings, RTTModalProps } from '../../react-components/src';
/* @conditional-compile-remove(rtt) */
export { RTTModal } from '../../react-components/src';

/* @conditional-compile-remove(rtt) */
export type { RTTDisclosureBannerProps, RTTDisclosureBannerStrings } from '../../react-components/src';
/* @conditional-compile-remove(rtt) */
export { RTTDisclosureBanner } from '../../react-components/src';
/* @conditional-compile-remove(rtt) */
export type { RealTimeTextProps, RealTimeTextStrings } from '../../react-components/src/components/RealTimeText';
/* @conditional-compile-remove(rtt) */
export { RealTimeText } from '../../react-components/src/components/RealTimeText';
/* @conditional-compile-remove(media-access) */
export type { MediaAccess } from '../../react-components/src';
export type {
  CaptionsBannerProps,
  CaptionsInformation,
  CaptionsBannerStrings
} from '../../react-components/src/components/CaptionsBanner';
export { CaptionsBanner } from '../../react-components/src/components/CaptionsBanner';
