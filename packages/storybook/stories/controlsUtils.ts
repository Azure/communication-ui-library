// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CustomCallControlButtonProps, ErrorType, NotificationType } from '@azure/communication-react';
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

const defaultIncomingCallNotifications = [
  {
    callerInfo: {
      displayName: 'John Wick'
    },
    id: '1'
  },
  {
    callerInfo: {
      displayName: 'Dog'
    },
    id: '2'
  },
  {
    callerInfo: {
      displayName: 'Cat'
    },
    id: '3'
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
const notificationOptions: NotificationType[] = [
  'startVideoGeneric',
  'stopVideoGeneric',
  'muteGeneric',
  'unmuteGeneric',
  'speakingWhileMuted',
  'startScreenShareGeneric',
  'stopScreenShareGeneric',
  'callNetworkQualityLow',
  'teamsMeetingCallNetworkQualityLow',
  'callNoSpeakerFound',
  'callNoMicrophoneFound',
  'callMicrophoneAccessDenied',
  'callMicrophoneAccessDeniedSafari',
  'callMicrophoneMutedBySystem',
  'callMicrophoneUnmutedBySystem',
  'callMacOsMicrophoneAccessDenied',
  'callLocalVideoFreeze',
  'callCameraAccessDenied',
  'callCameraAccessDeniedSafari',
  'callCameraAlreadyInUse',
  'callVideoStoppedBySystem',
  'callVideoRecoveredBySystem',
  'callMacOsCameraAccessDenied',
  'callMacOsScreenShareAccessDenied',
  'failedToJoinCallGeneric',
  'failedToJoinCallInvalidMeetingLink',
  'cameraFrozenForRemoteParticipants',
  'unableToStartVideoEffect',
  'startSpotlightWhileMaxParticipantsAreSpotlighted',
  'mutedByRemoteParticipant',
  'recordingStarted',
  'transcriptionStarted',
  'recordingStopped',
  'transcriptionStopped',
  'recordingAndTranscriptionStarted',
  'recordingAndTranscriptionStopped',
  'recordingStoppedStillTranscribing',
  'transcriptionStoppedStillRecording'
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

const VIDEO_GALLERY_LAYOUTS = ['default', 'floatingLocalVideo', 'speaker', 'focusedContent'] as const;
const OVERFLOW_GALLERY_LAYOUTS = ['horizontalBottom', 'verticalRight', 'horizontalTop'] as const;

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
  isMe: { control: 'boolean', name: 'Is You' },
  isMicrophoneEnabled: { control: 'boolean', defaultValue: true, name: 'Is microphone available' },
  isMuteAllAvailable: {
    control: 'boolean',
    defaultValue: false,
    name: 'Mute all participants option'
  },
  isMuted: { control: 'boolean', defaultValue: false, name: 'Is muted' },
  isSpeaking: { control: 'boolean', defaultValue: false, name: 'Is Speaking' },
  isScreenSharing: { control: 'boolean', defaultValue: false, name: 'Is screen sharing' },
  isRaisedHand: { control: 'boolean', defaultValue: false, name: 'Is Raised Hand' },
  isSendBoxWithWarning: { control: 'boolean', defaultValue: false, name: 'Has warning/information message' },
  isSendBoxWithAttachments: { control: 'boolean', defaultValue: false, name: 'Has attachments' },
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
  participantItemMenuItemsStr: {
    control: 'text',
    name: 'Menu items (comma separated)',
    defaultValue: 'Mute, Remove'
  },
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
  teamsMeetingId: { control: 'text', defaultValue: '', name: 'Teams meeting Id' },
  teamsMeetingPasscode: { control: 'text', defaultValue: '', name: 'Teams meeting passcode' },
  theme: { control: 'radio', options: themeChoices, defaultValue: 'Default', name: 'Theme' },
  token: { control: 'text', defaultValue: '', name: 'Valid token for user', type: { name: 'string', required: true } },
  typingUsers: { control: 'object', defaultValue: defaultTypingUsers, name: 'Typing users' },
  isCaptionsFeatureActive: { control: 'boolean', defaultValue: true, name: 'Is captions on' },
  richTextEditor: { control: 'boolean', defaultValue: false, name: 'Enable rich text editor' },
  isNotificationAutoDismiss: { control: 'boolean', defaultValue: false, name: 'Is auto dismiss on' },
  showNotificationStacked: { control: 'boolean', defaultValue: false, name: 'Show notification stacked effect' },
  incomingCalls: { control: 'object', defaultValue: defaultIncomingCallNotifications, name: 'Incoming Calls' },
  maxIncomingCallsToShow: {
    control: 'select',
    options: [1, 2, 3],
    defaultValue: '2',
    name: 'Number of incoming calls'
  },
  activeNotifications: {
    control: 'check',
    options: notificationOptions,
    defaultValue: ['startVideoGeneric'],
    name: 'activeNotifications'
  },
  maxNotificationsToShow: {
    control: 'select',
    options: [1, 2, 3],
    defaultValue: '2',
    name: 'Select max number of notifications to show'
  },
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
    defaultValue: 'horizontalBottom',
    name: 'Overflow Gallery Position'
  },
  localVideoTileSize: {
    control: 'select',
    options: ['9:16', '16:9', 'hidden', 'followDeviceOrientation'],
    defaultValue: 'followDeviceOrientation',
    name: 'Local Video Tile Size'
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
  customButtonInjectionControls: {
    placement: {
      control: 'select',
      if: { arg: 'allowRawObjectInput', truthy: false },
      options: ['primary', 'secondary', 'overflow'],
      defaultValue: 'primary',
      name: 'Placement'
    },
    disabled: {
      control: 'boolean',
      if: { arg: 'allowRawObjectInput', truthy: false },
      defaultValue: 'false',
      name: 'Disabled'
    },
    label: {
      control: 'text',
      if: { arg: 'allowRawObjectInput', truthy: false },
      defaultValue: 'Custom',
      name: 'Button label'
    },
    icon: {
      control: 'text',
      if: { arg: 'allowRawObjectInput', truthy: false },
      defaultValue: 'DefaultCustomButton',
      name: 'Button icon'
    },
    showLabel: {
      control: { type: 'radio' },
      if: { arg: 'allowRawObjectInput', truthy: false },
      defaultValue: 'undefined',
      options: ['undefined', false, true],
      name: 'Show Label'
    },
    allowRawObjectInput: {
      control: 'boolean',
      defaultValue: false,
      if: { arg: 'injectMaximumNumberOfButtons', truthy: false },
      name: 'Inject your own buttons'
    },
    objectOptions: {
      control: 'object',
      if: { arg: 'allowRawObjectInput' },
      defaultValue: [
        (): CustomCallControlButtonProps => ({
          placement: 'primary',
          strings: {
            label: 'Custom'
          }
        }),
        (): CustomCallControlButtonProps => ({
          placement: 'secondary',
          strings: {
            label: 'Custom'
          }
        }),
        (): CustomCallControlButtonProps => ({
          placement: 'overflow',
          strings: {
            label: 'Custom'
          }
        })
      ]
    },
    injectMaximumNumberOfButtons: {
      control: 'boolean',
      defaultValue: false,
      if: { arg: 'allowRawObjectInput', truthy: false },
      name: 'Inject Max # of Custom Buttons'
    }
  }
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
