import {
  AsyncLocalizationProvider,
  COMPONENT_LOCALE_JA_JP,
  COMPONENT_LOCALE_FR_FR,
  COMPONENT_LOCALE_EN_US,
  ComponentLocale,
  CameraButton
} from '@azure/communication-react';
import React from 'react';

export const AsyncLocalesSnippet = (): JSX.Element => {
  //  mock API functions
  const localeAPIforEN_US = async (): Promise<ComponentLocale> => {
    return COMPONENT_LOCALE_EN_US as ComponentLocale;
  };
  const localeAPIforFR_FR = async (): Promise<ComponentLocale> => {
    return COMPONENT_LOCALE_FR_FR as ComponentLocale;
  };
  const localeAPIforJA_JP = async (): Promise<ComponentLocale> => {
    return COMPONENT_LOCALE_JA_JP as ComponentLocale;
  };

  const localeLoader = async (locale?: string): Promise<ComponentLocale> => {
    switch (locale) {
      case 'fr-fr':
        return await localeAPIforFR_FR();
      case 'ja-JP':
        return await localeAPIforJA_JP();
      default:
        return await localeAPIforEN_US();
    }
  };

  return (
    <AsyncLocalizationProvider defaultLocale="ja-JP" localeLoader={localeLoader}>
      <CameraButton showLabel />
    </AsyncLocalizationProvider>
  );
};
