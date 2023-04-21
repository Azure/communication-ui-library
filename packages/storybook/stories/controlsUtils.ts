// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ErrorType } from '@azure/communication-react';
import { PartialTheme } from '@fluentui/react';
import { DefaultTheme, DarkTheme, TeamsTheme, WordTheme } from '@fluentui/theme-samples';
import {
  mediaGalleryWidthDefault,
  mediaGalleryWidthOptions,
  mediaGalleryHeightDefault,
  mediaGalleryHeightOptions
} from './constants';

const botAvatars = ['Default', 'Cat', 'Fox', 'Koala'];
export const getControlledBotAvatarSymbol = (AvatarName: string): string => {
  switch (AvatarName) {
    case 'Default':
      return '🤖';
    case 'Cat':
      return '🐱';
    case 'Fox':
      return '🦊';
    case 'Koala':
      return '🐨';
  }
  return '🤖';
};

const CONTROL_BAR_LAYOUTS = [
  'horizontal',
  'vertical',
  'dockedTop',
  'dockedBottom',
  'dockedLeft',
  'dockedRight',
  'floatingTop',
  'floatingBottom',
  'floatingLeft',
  'floatingRight'
] as const;

export const defaultControlsCameras: { id: string; name: string }[] = [
  { id: 'camera1', name: 'Full HD Webcam' },
  { id: 'camera2', name: 'Macbook Pro Webcam' }
];

export const defaultControlsMicrophones: { id: string; name: string }[] = [
  { id: 'mic1', name: 'Realtek HD Audio' },
  { id: 'mic2', name: 'Macbook Pro Mic' }
];

export const defaultControlsSpeakers: { id: string; name: string }[] = [
  { id: 'speaker1', name: 'Realtek HD Audio' },
  { id: 'speaker2', name: 'Macbook Pro Speaker' }
];

const defaultControlsGridParticipants = [
  {
    displayName: 'Michael',
    isVideoReady: false
  },
  {
    displayName: 'Jim',
    isVideoReady: false
  },
  {
    displayName: 'Pam',
    isVideoReady: false
  },
  {
    displayName: 'Dwight',
    isVideoReady: false
  }
];

const defaultLocalParticipant = [{ name: 'You', status: 'Connected', isMuted: false, isScreenSharing: false }];
const defaultRemoteParticipants = [
  { name: 'Rick', status: 'InLobby', isMuted: false, isScreenSharing: false },
  { name: 'Daryl', status: 'Connecting', isMuted: false, isScreenSharing: false },
  { name: 'Michonne', status: 'Idle', isMuted: false, isScreenSharing: false }
];

const defaultMentionSuggestions = [
  { id: '1', displayText: 'Harry Hopkins' },
  { id: '2', displayText: 'Charles Macdonald' },
  { id: '3', displayText: 'Hayden Thomson' },
  { id: '4', displayText: 'Marc Cox' },
  { id: '5', displayText: 'Stevie Knox' },
  { id: '6', displayText: 'Rebecca Huff' },
  { id: 'everyone', displayText: 'Everyone' }
];

const defaultTypingUsers = [
  {
    userId: '1',
    displayName: 'User1'
  },
  {
    userId: '2',
    displayName: 'User2'
  }
];

const errorOptions: ErrorType[] = [
  'unableToReachChatService',
  'accessDenied',
  'userNotInChatThread',
  'sendMessageNotInChatThread',
  'sendMessageGeneric',
  'startVideoGeneric',
  'stopVideoGeneric',
  'muteGeneric',
  'unmuteGeneric',
  'startScreenShareGeneric',
  'stopScreenShareGeneric',
  'callNetworkQualityLow',
  'callNoSpeakerFound',
  'callNoMicrophoneFound',
  'callMicrophoneAccessDenied',
  'callMicrophoneMutedBySystem',
  'callMicrophoneUnmutedBySystem',
  'callMacOsMicrophoneAccessDenied',
  'callLocalVideoFreeze',
  'callCameraAlreadyInUse',
  'callMacOsCameraAccessDenied',
  'callMacOsScreenShareAccessDenied',
  'callVideoStoppedBySystem',
  'callVideoRecoveredBySystem'
];

const themeChoices = ['Default', 'Dark', 'Teams', 'Word'];
export const getControlledTheme = (choice: string): PartialTheme => {
  switch (choice) {
    case 'Default':
      return DefaultTheme;
    case 'Dark':
      return DarkTheme;
    case 'Teams':
      return TeamsTheme;
    case 'Word':
      return WordTheme;
  }
  return DefaultTheme;
};

const VIDEO_GALLERY_LAYOUTS = ['default', 'floatingLocalVideo'] as const;
const OVERFLOW_GALLERY_LAYOUTS = ['HorizontalBottom', 'VerticalRight'] as const;

export const orientationArg = {
  options: ['landscape', 'portrait'],
  control: { type: 'radio' },
  defaultValue: 'landscape'
};

export const controlsToAdd = {
  alternateCallerId: {
    control: 'text',
    description: 'added',
    defaultValue: '',
    name: 'Alternate CallerID',
    type: { name: 'string', required: true }
  },
  appName: {
    control: 'text',
    defaultValue: 'Storybook',
    name: 'App Name'
  },
  avatarInitials: { control: 'text', defaultValue: 'A B', name: 'Avatar initials' },
  botAvatar: { control: 'radio', options: botAvatars, defaultValue: 'Default', name: 'Bot Avatar' },
  botChatTopic: {
    control: 'text',
    defaultValue: 'Chat with a friendly bot',
    name: 'Chat Topic',
    type: { name: 'string', required: true }
  },
  botToken: {
    control: 'text',
    defaultValue: '',
    name: 'Valid token for bot',
    type: { name: 'string', required: true }
  },
  botUserId: {
    control: 'text',
    defaultValue: '',
    name: 'User identifier for bot',
    type: { name: 'string', required: true }
  },
  calleeUserId: {
    control: 'text',
    defaultValue: '8:echo123',
    name: "Callee's User identifier",
    type: { name: 'string', required: true }
  },
  calleeToken: { control: 'text', defaultValue: '', name: "Callee's Valid token" },
  callerImages: { control: 'file', accept: '.jpeg, .jpg, .png', defaultValue: [], name: 'Avatar' },
  callerName: { control: 'text', defaultValue: 'Maximus Aurelius', name: 'Caller Name' },
  callerNameAlt: { control: 'text', defaultValue: '1st', name: 'Caller Name Alt' },
  callerTitle: { control: 'text', defaultValue: 'Emperor and Philosopher, Rome', name: 'Caller Title' },
  callInvitationURL: {
    control: 'text',
    defaultValue: '',
    name: 'URL to invite other participants to the call'
  },
  callLocator: {
    control: 'text',
    defaultValue: '',
    name: 'Call locator (ACS group ID, Teams meeting link, or Room ID)'
  },
  callParticipantsLocator: {
    control: 'array',
    defaultValue: ['+###########'],
    name: 'Call locator (participants phone numbers)',
    type: { name: 'string', required: true }
  },
  callModalAlertText: { control: 'text', defaultValue: 'Incoming Video Call', name: 'Alert Text' },
  callToastAlertText: { control: 'text', defaultValue: 'Incoming Call', name: 'Alert Text' },
  callStateText: { control: 'text', defaultValue: "You're in the lobby", name: 'Call State Text' },
  callStateSubText: { control: 'text', defaultValue: 'You should be admitted shortly', name: 'Call State Subtext' },
  cameras: { control: 'object', defaultValue: defaultControlsCameras, name: 'Cameras' },
  chatThreadId: {
    control: 'text',
    defaultValue: '',
    name: 'Existing thread',
    type: { name: 'string', required: true }
  },
  checked: { control: 'boolean', defaultValue: false, name: 'Is checked' },
  controlBarDefaultIcons: {
    control: 'radio',
    options: ['airplane', 'bus', 'ship'],
    defaultValue: 'airplane',
    name: 'Icon'
  },
  controlBarLayout: {
    control: 'select',
    options: CONTROL_BAR_LAYOUTS,
    defaultValue: 'floatingBottom',
    name: 'Layout'
  },
  siteDeviceRequest: {
    control: 'select',
    options: ['Camera and Microphone', 'Camera Only', 'Microphone Only'],
    defaultValue: 'Camera and Microphone',
    name: 'Device Request Type'
  },
  siteDeviceRequestStatus: {
    control: 'select',
    options: ['Request', 'Denied', 'Check'],
    defaultValue: 'Request',
    name: 'Request Status'
  },
  disabled: { control: 'boolean', defaultValue: false, name: 'Disable component' },
  displayName: { control: 'text', defaultValue: 'John Smith', name: 'Display Name' },
  enableJumpToNewMessageButton: { control: 'boolean', defaultValue: true, name: 'Enable Jump To New Message' },
  endpointUrl: {
    control: 'text',
    defaultValue: '',
    name: 'Azure Communication Services endpoint',
    type: { name: 'string', required: true }
  },
  errorTypes: {
    control: 'check',
    options: errorOptions,
    defaultValue: ['accessDenied'],
    name: 'ErrorType'
  },
  excludeMeFromList: { control: 'boolean', defaultValue: false, name: 'Are you excluded from the list' },
  font: { control: 'text', defaultValue: 'Monaco, Menlo, Consolas', name: 'Font' },
  gridParticipants: { control: 'object', defaultValue: defaultControlsGridParticipants, name: 'Participants' },
  isCameraEnabled: { control: 'boolean', defaultValue: true, name: 'Is camera available' },
  isMe: { control: 'boolean', defaultValue: false, name: 'Is You' },
  isMicrophoneEnabled: { control: 'boolean', defaultValue: true, name: 'Is microphone available' },
  isMuteAllAvailable: {
    control: 'boolean',
    defaultValue: false,
    name: 'Mute all participants option'
  },
  isMuted: { control: 'boolean', defaultValue: false, name: 'Is muted' },
  isSpeaking: { control: 'boolean', defaultValue: false, name: 'Is Speaking' },
  isScreenSharing: { control: 'boolean', defaultValue: false, name: 'Is screen sharing' },
  isSendBoxWithWarning: { control: 'boolean', defaultValue: false, name: 'Has warning/information message' },
  isVideoAvailable: { control: 'boolean', defaultValue: true, name: 'Is video available' },
  isVideoMirrored: { control: 'boolean', defaultValue: false, name: 'Is video mirrored' },
  isVideoReady: { control: 'boolean', defaultValue: false, name: 'Is Video ready' },
  layoutHeight: {
    control: {
      type: 'range',
      min: mediaGalleryHeightOptions.min,
      max: mediaGalleryHeightOptions.max,
      step: mediaGalleryHeightOptions.step
    },
    defaultValue: mediaGalleryHeightDefault,
    name: 'Height (px)'
  },
  layoutWidth: {
    control: {
      type: 'range',
      min: mediaGalleryWidthOptions.min,
      max: mediaGalleryWidthOptions.max,
      step: mediaGalleryWidthOptions.step
    },
    defaultValue: mediaGalleryWidthDefault,
    name: 'Width (px)'
  },
  localParticipantDisplayName: { control: 'text', defaultValue: 'John Doe', name: 'Local Participant displayName' },
  localParticipant: { control: 'object', defaultValue: defaultLocalParticipant, name: 'Your information' },
  localVideoInverted: { control: 'boolean', defaultValue: true, name: 'Invert Local Video' },
  localVideoStreamEnabled: { control: 'boolean', defaultValue: true, name: 'Turn Local Video On' },
  messageDeliveredTooltipText: { control: 'text', defaultValue: 'Sent', name: 'Delivered icon tooltip text' },
  messageFailedToSendTooltipText: {
    control: 'text',
    defaultValue: 'Failed to send',
    name: 'Failed to send icon tooltip text'
  },
  messageSeenTooltipText: { control: 'text', defaultValue: 'Seen', name: 'Seen icon tooltip text' },
  messageReadByTooltipText: { control: 'text', defaultValue: 'Read by 2 of 2', name: 'Read by icon tooltip text' },
  messageSendingTooltipText: { control: 'text', defaultValue: 'Sending', name: 'Sending icon tooltip text' },
  messageStatus: {
    control: 'select',
    options: ['delivered', 'sending', 'seen', 'failed'],
    defaultValue: 'delivered',
    name: 'Message Status'
  },
  microphones: { control: 'object', defaultValue: defaultControlsMicrophones, name: 'Microphones' },
  formFactor: {
    control: 'select',
    options: ['desktop', 'mobile'],
    defaultValue: 'desktop',
    name: 'Form factor'
  },
  participantItemMenuItemsStr: { control: 'text', defaultValue: 'Mute, Remove', name: 'Menu items (comma separated)' },
  participantNames: {
    control: 'text',
    defaultValue: 'You, Hal Jordan, Barry Allen, Bruce Wayne',
    name: 'Participants (comma separated with You being local user)'
  },
  remoteParticipantNames: {
    control: 'text',
    defaultValue:
      'Rick, Daryl, Michonne, Dwight, Pam, Michael, Jim, Kevin, Creed, Angela, Andy, Stanley, Meredith, Phyllis, Oscar, Ryan, Kelly, Andy, Toby, Darryl, Gabe, Erin',
    name: 'Remote participants (comma separated)'
  },
  remoteParticipants: { control: 'object', defaultValue: defaultRemoteParticipants, name: 'Remote participants' },
  requiredDisplayName: {
    control: 'text',
    defaultValue: 'John Smith',
    name: 'Display name',
    type: { required: true, name: 'string' }
  },
  screenShareExperience: {
    control: 'select',
    options: ['none', 'presenter', 'viewer'],
    defaultValue: 'none',
    name: 'Screen sharing experience'
  },
  sendBoxWarningMessage: {
    control: 'text',
    defaultValue: 'Please wait 30 seconds to send new messages',
    name: 'Warning/information message for SendBox'
  },
  showChatParticipants: { control: 'boolean', defaultValue: true, name: 'Show Participants Pane' },
  showChatTopic: { control: 'boolean', defaultValue: true, name: 'Show Topic' },
  showErrorBar: { control: 'boolean', defaultValue: true, name: 'Show ErrorBar' },
  showLabel: { control: 'boolean', defaultValue: false, name: 'Show label' },
  showVideoTileLabel: { control: 'boolean', defaultValue: true, name: 'Show label' },
  showMessageDate: { control: 'boolean', defaultValue: true, name: 'Enable Message Date' },
  showMessageStatus: { control: 'boolean', defaultValue: true, name: 'Enable Message Status Indicator' },
  showMuteIndicator: { control: 'boolean', defaultValue: true, name: 'Show Mute/UnMute Indicator' },
  speakers: { control: 'object', defaultValue: defaultControlsSpeakers, name: 'Speakers' },
  teamsMeetingLink: { control: 'text', defaultValue: '', name: 'Teams meeting link' },
  theme: { control: 'radio', options: themeChoices, defaultValue: 'Default', name: 'Theme' },
  token: { control: 'text', defaultValue: '', name: 'Valid token for user', type: { name: 'string', required: true } },
  typingUsers: { control: 'object', defaultValue: defaultTypingUsers, name: 'Typing users' },
  userId: {
    control: 'text',
    defaultValue: '',
    name: 'User identifier for user',
    type: { name: 'string', required: true }
  },
  videoGallerylayout: {
    control: 'select',
    options: VIDEO_GALLERY_LAYOUTS,
    defaultValue: 'floatingLocalVideo',
    name: 'VideoGallery Layout'
  },
  overflowGalleryPosition: {
    control: 'select',
    options: OVERFLOW_GALLERY_LAYOUTS,
    defaultValue: 'HorizontalBottom',
    name: 'Overflow Gallery Position'
  },
  videoTileHeight: { control: { type: 'range', min: 80, max: 800, step: 10 }, defaultValue: 300, name: 'Height (px)' },
  videoTileWidth: { control: { type: 'range', min: 100, max: 1200, step: 10 }, defaultValue: 400, name: 'Width (px)' },
  callWithChatControlOptions: {
    control: 'object',
    defaultValue: {
      microphoneButton: true,
      cameraButton: true,
      screenShareButton: true,
      devicesButton: true,
      peopleButton: true,
      chatButton: true,
      displayType: 'default'
    },
    name: 'Control Bar Customizations'
  },
  mentionSuggestions: {
    control: 'object',
    defaultValue: defaultMentionSuggestions,
    name: 'Mention Suggestions'
  },
  title: { control: 'text', defaultValue: 'Suggestions', name: 'Title' }
};

export const hiddenControl = { control: false, table: { disable: true } };

export const defaultCallCompositeHiddenControls = {
  adapter: hiddenControl,
  fluentTheme: hiddenControl,
  onRenderAvatar: hiddenControl,
  identifiers: hiddenControl,
  locale: hiddenControl,
  onFetchAvatarPersonaData: hiddenControl,
  rtl: hiddenControl,
  options: hiddenControl,
  callInvitationUrl: hiddenControl,
  formFactor: hiddenControl, // formFactor is hidden by default and compositeFormFactor is used as a prop instead to workaround a bug where formFactor is not put in the correct order when the controls are generated
  role: hiddenControl // TODO: once role work is complete this should be added as a drop down control
};

export const defaultChatCompositeHiddenControls = {
  adapter: hiddenControl,
  fluentTheme: hiddenControl,
  onRenderAvatar: hiddenControl,
  onRenderMessage: hiddenControl,
  onRenderTypingIndicator: hiddenControl,
  options: hiddenControl,
  identifiers: hiddenControl,
  locale: hiddenControl,
  onFetchAvatarPersonaData: hiddenControl,
  rtl: hiddenControl,
  formFactor: hiddenControl // formFactor is hidden by default and compositeFormFactor is used as a prop instead to workaround a bug where formFactor is not put in the correct order when the controls are generated
};

export const defaultCallWithChatCompositeHiddenControls = {
  adapter: hiddenControl,
  fluentTheme: hiddenControl,
  joinInvitationURL: hiddenControl,
  rtl: hiddenControl,
  options: hiddenControl,
  formFactor: hiddenControl // formFactor is hidden by default and compositeFormFactor is used as a prop instead to workaround a bug where formFactor is not put in the correct order when the controls are generated
};

/**
 * Helper function to get strongly typed storybook args.
 *
 * @remarks
 * This only extracts the keys of the storybook control args and not the type of each control.
 * This is because we cannot type infer between the storybook control and its output.
 * Instead, for ease of use, we use `any`.
 */
export type ArgsFrom<TControlArgs> = Record<keyof TControlArgs, any>;
