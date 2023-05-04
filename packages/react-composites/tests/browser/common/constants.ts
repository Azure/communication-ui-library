// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
  fileTypeIcon: 'filetype-icon',
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
  atMentionSuggestionList: 'at-mention-suggestion-list',
  atMentionSuggestionItem: 'at-mention-suggestion-item'
};

export const captionsAvailableLanguageStrings = [
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

export const captionsFeatureState = {
  captions: [
    {
      resultType: 'Final' as const,
      timestamp: new Date(0),
      speaker: {
        displayName: 'Participant 1',
        identifier: { communicationUserId: 'communicationId1', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'en-us' as const,
      captionText: 'How are you?'
    },
    {
      resultType: 'Final' as const,
      timestamp: new Date(10000),
      speaker: {
        displayName: 'Participant 2',
        identifier: { communicationUserId: 'communicationId2', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'en-us',
      captionText: 'I am good.'
    },
    {
      resultType: 'Final' as const,
      timestamp: new Date(10001),
      speaker: {
        displayName: 'Participant 3',
        identifier: { communicationUserId: 'communicationId3', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'en-us',
      captionText: 'Nice to see you today!'
    }
  ],
  supportedSpokenLanguages: captionsAvailableLanguageStrings,
  supportedCaptionLanguages: captionsAvailableLanguageStrings,
  currentCaptionLanguage: 'en-us',
  currentSpokenLanguage: 'en-us',
  isCaptionsFeatureActive: true,
  startCaptionsClicked: true
};

export const captionsFeatureStateArabic = {
  captions: [
    {
      resultType: 'Final' as const,
      timestamp: new Date(0),
      speaker: {
        displayName: 'Participant 1',
        identifier: { communicationUserId: 'communicationId1', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'ar-ae' as const,
      captionText: '!سعيد بلقائك! مرحبًا'
    },
    {
      resultType: 'Final' as const,
      timestamp: new Date(10000),
      speaker: {
        displayName: 'Participant 2',
        identifier: { communicationUserId: 'communicationId2', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'ar-ae' as const,
      captionText: 'انا جيد، كيف حالك؟'
    },
    {
      resultType: 'Final' as const,
      timestamp: new Date(10001),
      speaker: {
        displayName: 'Participant 3',
        identifier: { communicationUserId: 'communicationId3', kind: 'communicationUser' as const }
      },
      spokenLanguage: 'ar-ae' as const,
      captionText: '!سُعدت برؤيتك'
    }
  ],
  supportedSpokenLanguages: captionsAvailableLanguageStrings,
  supportedCaptionLanguages: captionsAvailableLanguageStrings,
  currentCaptionLanguage: 'ar-ae',
  currentSpokenLanguage: 'ar-ae',
  isCaptionsFeatureActive: true
};
