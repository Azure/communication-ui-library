// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export type { Disposable, AdapterState } from './common/adapters';

export * from './ChatComposite';
export * from './CallComposite';
export * from './CallWithChatComposite';
export { COMPOSITE_LOCALE_EN_GB } from './localization/locales/en-GB/CompositeLocale';
export { COMPOSITE_LOCALE_AR_SA } from './localization/locales/ar-SA/CompositeLocale';
export { COMPOSITE_LOCALE_CS_CZ } from './localization/locales/cs-CZ/CompositeLocale';
export { COMPOSITE_LOCALE_DE_DE } from './localization/locales/de-DE/CompositeLocale';
export { COMPOSITE_LOCALE_ES_ES } from './localization/locales/es-ES/CompositeLocale';
export { COMPOSITE_LOCALE_FI_FI } from './localization/locales/fi-FI/CompositeLocale';
export { COMPOSITE_LOCALE_FR_FR } from './localization/locales/fr-FR/CompositeLocale';
export { COMPOSITE_LOCALE_HE_IL } from './localization/locales/he-IL/CompositeLocale';
export { COMPOSITE_LOCALE_IT_IT } from './localization/locales/it-IT/CompositeLocale';
export { COMPOSITE_LOCALE_JA_JP } from './localization/locales/ja-JP/CompositeLocale';
export { COMPOSITE_LOCALE_KO_KR } from './localization/locales/ko-KR/CompositeLocale';
export { COMPOSITE_LOCALE_NB_NO } from './localization/locales/nb-NO/CompositeLocale';
export { COMPOSITE_LOCALE_NL_NL } from './localization/locales/nl-NL/CompositeLocale';
export { COMPOSITE_LOCALE_PL_PL } from './localization/locales/pl-PL/CompositeLocale';
export { COMPOSITE_LOCALE_PT_BR } from './localization/locales/pt-BR/CompositeLocale';
export { COMPOSITE_LOCALE_RU_RU } from './localization/locales/ru-RU/CompositeLocale';
export { COMPOSITE_LOCALE_SV_SE } from './localization/locales/sv-SE/CompositeLocale';
export { COMPOSITE_LOCALE_TR_TR } from './localization/locales/tr-TR/CompositeLocale';
export { COMPOSITE_LOCALE_ZH_CN } from './localization/locales/zh-CN/CompositeLocale';
export { COMPOSITE_LOCALE_ZH_TW } from './localization/locales/zh-TW/CompositeLocale';

export type { CallControlDisplayType, CommonCallControlOptions } from './common/types/CommonCallControlOptions';

export type { AvatarPersonaData, AvatarPersonaDataCallback } from './common/AvatarPersona';
export { COMPOSITE_ONLY_ICONS, DEFAULT_COMPOSITE_ICONS } from './common/icons';
export type {
  CompositeIcons,
  ChatCompositeIcons,
  CallCompositeIcons,
  CallWithChatCompositeIcons
} from './common/icons';
export * from './localization/locales';
export type { CompositeStrings, CompositeLocale } from './localization';
export type { AdapterError, AdapterErrors } from './common/adapters';
/* @conditional-compile-remove(breakout-rooms) */
export type { AdapterNotification, AdapterNotifications } from './common/adapters';
export type { BaseCompositeProps } from './common/BaseComposite';
export type {
  CustomCallControlButtonCallback,
  CustomCallControlButtonPlacement,
  CustomCallControlButtonCallbackArgs,
  CustomCallControlButtonStrings
} from './common/ControlBar/CustomButton';

export { onResolveVideoEffectDependencyLazy } from './common/resolveVideoEffectDependencyLazy';

export { onResolveVideoEffectDependency } from './common/resolveVideoEffectDependency';
/* @conditional-compile-remove(DNS) */
export { onResolveDeepNoiseSuppressionDependencyLazy } from './common/resolveDeepNoiseSuppressionDependencyLazy';
/* @conditional-compile-remove(DNS) */
export { onResolveDeepNoiseSuppressionDependency } from './common/resolveDeepNoiseSuppressionDependency';
