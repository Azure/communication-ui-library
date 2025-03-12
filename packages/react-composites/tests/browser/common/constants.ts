// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const CHAT_TOPIC_NAME = 'Cowabunga';

export const TEST_PARTICIPANTS_CHAT = ['Dorian Gutmann', 'Poppy Bjørgen', 'Dave Pokahl'];

export const TEST_PARTICIPANTS = ['Dorian Gutmann', 'Poppy Bjørgen'];

export const IDS = {
  sendboxTextField: 'sendbox-textfield',
  participantButtonPeopleMenuItem: 'participant-button-people-menu-item',
  participantItemMenuButton: 'participant-item-menu-button',
  participantList: 'participant-list',
  participantListPeopleButton: 'participant-list-people-button',
  participantListRemoveParticipantButton: 'participant-list-remove-participant-button',
  messageContent: 'message-content',
  messageTimestamp: 'message-timestamp',
  typingIndicator: 'typing-indicator',
  videoGallery: 'video-gallery',
  videoTile: 'video-tile',
  videoTileMoreOptionsButton: 'video-tile-more-options-button',
  overflowGalleryLeftNavButton: 'overflow-gallery-left-nav-button',
  overflowGalleryRightNavButton: 'overflow-gallery-right-nav-button',
  readReceiptTooltip: 'chat-composite-message-tooltip',
  attachmentTypeIcon: 'attachmenttype-icon',
  deviceButton: 'calling-composite-devices-button',
  resumeCallButton: 'hold-page-resume-call-button',
  holdButton: 'hold-button',
  holdPage: 'hold-page',
  moreButton: 'common-call-composite-more-button',
  callPage: 'call-page',
  unsupportedEnvironmentIcon: 'unsupported-environment-icon',
  unsupportedEnvironmentLink: 'unsupported-environment-link',
  lobbyScreenTitle: 'lobbyScreenTitle',
  allowUnsupportedBrowserButton: 'allowUnsupportedBrowserButton',
  configurationScreenDevicesButton: 'call-composite-local-device-settings-options-button',
  verticalGalleryPageCounter: 'vertical-gallery-page-counter',
  verticalGalleryVideoTile: 'vertical-gallery-video-tile',
  horizontalGalleryVideoTile: 'horizontal-gallery-video-tile',
  mentionSuggestionList: 'mention-suggestion-list',
  mentionSuggestionItem: 'mention-suggestion-item',
  reactionButton: 'call-composite-reaction-button',
  reactionButtonSubMenu: 'reaction-sub-menu',
  reactionMobileDrawerMenuItem: 'reaction-mobile-drawer-menu-item',
  cameraButton: 'call-composite-camera-button',
  microphoneButton: 'call-composite-microphone-button',
  togetherModeStream: 'together-mode-layout'
};

export const spokenLanguageStrings = [
  'ar-ae',
  'ar-sa',
  'da-dk',
  'de-de',
  'en-au',
  'en-ca',
  'en-gb',
  'en-in',
  'en-nz',
  'en-us',
  'es-es',
  'es-mx',
  'fi-fi',
  'fr-ca',
  'fr-fr',
  'hi-in',
  'it-it',
  'ja-jp',
  'ko-kr',
  'nb-no',
  'nl-be',
  'nl-nl',
  'pl-pl',
  'pt-br',
  'ru-ru',
  'sv-se',
  'zh-cn',
  'zh-hk',
  'cs-cz',
  'pt-pt',
  'tr-tr',
  'vi-vn',
  'th-th',
  'he-il',
  'cy-gb',
  'uk-ua',
  'el-gr',
  'hu-hu',
  'ro-ro',
  'sk-sk',
  'zh-tw'
];
export const captionLanguageStrings = [
  'ar',
  'da',
  'de',
  'en',
  'es',
  'fi',
  'fr',
  'fr-ca',
  'hi',
  'it',
  'ja',
  'ko',
  'nb',
  'nl',
  'pl',
  'pt',
  'ru',
  'sv',
  'zh-Hans',
  'zh-Hant',
  'cs',
  'pt-pt',
  'tr',
  'vi',
  'th',
  'he',
  'cy',
  'uk',
  'el',
  'hu',
  'ro',
  'sk'
];
export const captionsFeatureState = {
  captions: [
    {
      resultType: 'Final' as const,
      timestamp: new Date(0),
      speaker: {
        displayName: 'Participant 1',
        identifier: { communicationUserId: '1', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'en-us' as const,
      captionText: 'How are you?'
    },
    {
      resultType: 'Final' as const,
      timestamp: new Date(10000),
      speaker: {
        displayName: 'Participant 2',
        identifier: { communicationUserId: '1', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'en-us',
      captionText: 'I am good.'
    },
    {
      resultType: 'Final' as const,
      timestamp: new Date(10001),
      speaker: {
        displayName: 'Participant 3',
        identifier: { communicationUserId: '1', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'en-us',
      captionText: 'Nice to see you today!'
    }
  ],
  supportedSpokenLanguages: spokenLanguageStrings,
  supportedCaptionLanguages: captionLanguageStrings,
  currentCaptionLanguage: 'en',
  currentSpokenLanguage: 'en-us',
  isCaptionsFeatureActive: true,
  startCaptionsInProgress: true,

  captionsKind: 'Captions' as const
};

export const captionsFeatureStateArabic = {
  captions: [
    {
      resultType: 'Final' as const,
      timestamp: new Date(0),
      speaker: {
        displayName: 'Participant 1',
        identifier: { communicationUserId: '1', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'ar-ae' as const,
      captionText: '!سعيد بلقائك! مرحبًا'
    },
    {
      resultType: 'Final' as const,
      timestamp: new Date(10000),
      speaker: {
        displayName: 'Participant 2',
        identifier: { communicationUserId: '1', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'ar-ae' as const,
      captionText: 'انا جيد، كيف حالك؟'
    },
    {
      resultType: 'Final' as const,
      timestamp: new Date(10001),
      speaker: {
        displayName: 'Participant 3',
        identifier: { communicationUserId: '1', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'ar-ae' as const,
      captionText: '!سُعدت برؤيتك'
    }
  ],
  supportedSpokenLanguages: spokenLanguageStrings,
  supportedCaptionLanguages: captionLanguageStrings,
  currentCaptionLanguage: 'ar',
  currentSpokenLanguage: 'ar-ae',
  isCaptionsFeatureActive: true,
  startCaptionsInProgress: true,

  captionsKind: 'Captions' as const
};

export const togetherModeSeatingPosition_w_1912_h_600 = {
  '8:orgid:Participant-1-id': {
    top: 121.50823529411764,
    left: 858.175834509804,
    width: 198.83478588235292,
    height: 149.10745098039214
  },
  '8:orgid:Participant-2-id': {
    top: 298.93176470588236,
    left: 635.1239913725491,
    width: 208.3941505882353,
    height: 156.27607843137255
  },
  '8:orgid:Participant-3-id': {
    top: 298.93176470588236,
    left: 851.8029247058824,
    width: 208.3941505882353,
    height: 156.27607843137255
  },
  '8:orgid:Participant-4-id': {
    top: 206.45647058823528,
    left: 747.9244949019608,
    width: 202.6585317647059,
    height: 151.9749019607843
  },
  '8:orgid:Participant-5-id': {
    top: 298.93176470588236,
    left: 1071.6683129411765,
    width: 208.3941505882353,
    height: 156.27607843137255
  },
  '8:orgid:Participant-6-id': {
    top: 36.20156862745097,
    left: 961.4169733333333,
    width: 193.09916705882353,
    height: 144.80627450980393
  },
  '8:orgid:Participant-7-id': {
    top: 206.45647058823528,
    left: 961.4169733333333,
    width: 202.6585317647059,
    height: 151.9749019607843
  },
  '8:orgid:Participant-8-id': {
    top: 121.50823529411764,
    left: 647.8698109803921,
    width: 198.83478588235292,
    height: 149.10745098039214
  },
  '8:orgid:Participant-9-id': {
    top: 36.20156862745097,
    left: 757.4838596078431,
    width: 193.09916705882353,
    height: 144.80627450980393
  },
  '8:orgid:Participant-10-id': {
    top: 121.50823529411764,
    left: 1065.2954031372549,
    width: 198.83478588235292,
    height: 149.10745098039214
  }
};

export const togetherModeSeatingPosition_w_700_h_500 = {
  '8:orgid:Participant-1-id': {
    top: 48.92235294117647,
    left: 214.6134650980392,
    width: 80.0560188235294,
    height: 60.03450980392157
  },
  '8:orgid:Participant-2-id': {
    top: 120.35764705882352,
    left: 124.8070337254902,
    width: 83.90486588235292,
    height: 62.920784313725484
  },
  '8:orgid:Participant-3-id': {
    top: 120.35764705882352,
    left: 212.04756705882352,
    width: 83.90486588235292,
    height: 62.920784313725484
  },
  '8:orgid:Participant-4-id': {
    top: 83.12470588235294,
    left: 170.22342901960783,
    width: 81.59555764705883,
    height: 61.189019607843136
  },
  '8:orgid:Participant-5-id': {
    top: 120.35764705882352,
    left: 300.57104941176476,
    width: 83.90486588235292,
    height: 62.920784313725484
  },
  '8:orgid:Participant-6-id': {
    top: 14.5756862745098,
    left: 256.18101333333334,
    width: 77.74671058823529,
    height: 58.30274509803922
  },
  '8:orgid:Participant-7-id': {
    top: 83.12470588235294,
    left: 256.18101333333334,
    width: 81.59555764705883,
    height: 61.189019607843136
  },
  '8:orgid:Participant-8-id': {
    top: 48.92235294117647,
    left: 129.93882980392158,
    width: 80.0560188235294,
    height: 60.03450980392157
  },
  '8:orgid:Participant-9-id': {
    top: 14.5756862745098,
    left: 174.0722760784314,
    width: 77.74671058823529,
    height: 58.30274509803922
  },
  '8:orgid:Participant-10-id': {
    top: 48.92235294117647,
    left: 298.005151372549,
    width: 80.0560188235294,
    height: 60.03450980392157
  }
};
