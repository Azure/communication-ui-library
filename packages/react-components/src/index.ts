// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export * from './components';
export { _IdentifierProvider } from './identifiers';
export type { _Identifiers, _IdentifierProviderProps } from './identifiers';
export * from './localization/locales';
export { LocalizationProvider } from './localization';
export { COMPONENT_LOCALE_EN_GB } from './localization/locales/en-GB/ComponentLocale';
export { COMPONENT_LOCALE_AR_SA } from './localization/locales/ar-SA/ComponentLocale';
export { COMPONENT_LOCALE_CS_CZ } from './localization/locales/cs-CZ/ComponentLocale';
export { COMPONENT_LOCALE_CY_GB } from './localization/locales/cy-GB/ComponentLocale';
export { COMPONENT_LOCALE_DE_DE } from './localization/locales/de-DE/ComponentLocale';
export { COMPONENT_LOCALE_ES_ES } from './localization/locales/es-ES/ComponentLocale';
export { COMPONENT_LOCALE_ES_MX } from './localization/locales/es-MX/ComponentLocale';
export { COMPONENT_LOCALE_FI_FI } from './localization/locales/fi-FI/ComponentLocale';
export { COMPONENT_LOCALE_FR_FR } from './localization/locales/fr-FR/ComponentLocale';
export { COMPONENT_LOCALE_FR_CA } from './localization/locales/fr-CA/ComponentLocale';
export { COMPONENT_LOCALE_HE_IL } from './localization/locales/he-IL/ComponentLocale';
export { COMPONENT_LOCALE_IT_IT } from './localization/locales/it-IT/ComponentLocale';
export { COMPONENT_LOCALE_JA_JP } from './localization/locales/ja-JP/ComponentLocale';
export { COMPONENT_LOCALE_KO_KR } from './localization/locales/ko-KR/ComponentLocale';
export { COMPONENT_LOCALE_NB_NO } from './localization/locales/nb-NO/ComponentLocale';
export { COMPONENT_LOCALE_NL_NL } from './localization/locales/nl-NL/ComponentLocale';
export { COMPONENT_LOCALE_PL_PL } from './localization/locales/pl-PL/ComponentLocale';
export { COMPONENT_LOCALE_PT_BR } from './localization/locales/pt-BR/ComponentLocale';
export { COMPONENT_LOCALE_RU_RU } from './localization/locales/ru-RU/ComponentLocale';
export { COMPONENT_LOCALE_SV_SE } from './localization/locales/sv-SE/ComponentLocale';
export { COMPONENT_LOCALE_TR_TR } from './localization/locales/tr-TR/ComponentLocale';
export { COMPONENT_LOCALE_ZH_CN } from './localization/locales/zh-CN/ComponentLocale';
export { COMPONENT_LOCALE_ZH_TW } from './localization/locales/zh-TW/ComponentLocale';
export type { ComponentStrings, ComponentLocale, LocalizationProviderProps } from './localization';
export * from './theming';
export * from './theming/generateTheme';

export type {
  BaseCustomStyles,
  CallParticipantListParticipant,
  ChatMessage,
  CommunicationParticipant,
  ComponentSlotStyle,
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

export type { RaisedHand } from './types';

export type { Spotlight } from './types';

export type { Reaction, ReactionResources, ReactionSprite } from './types';

export type {
  SpokenLanguageStrings,
  CaptionLanguageStrings,
  _SupportedSpokenLanguage,
  _SupportedCaptionLanguage
} from './types';
export { _spokenLanguageToCaptionLanguage } from './types';

/* @conditional-compile-remove(data-loss-prevention) */
export type { BlockedMessage } from './types';

export type { SurveyIssues } from './types';

export type { SurveyIssuesHeadingStrings } from './types';

export type { CallSurveyImprovementSuggestions } from './types';

/* @conditional-compile-remove(together-mode) */
export type { TogetherModeStreamViewResult } from './types';

/* @conditional-compile-remove(media-access) */
export type { MediaAccess } from './types';
