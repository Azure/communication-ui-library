// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CaptionLanguageStrings,
  CaptionsSettingsModal as CaptionsSettingsModalComponent,
  SpokenLanguageStrings
} from '@azure/communication-react';
import { mergeStyles, PrimaryButton, Stack } from '@fluentui/react';
import React, { useState } from 'react';

const CaptionsSettingsModalStory = (): JSX.Element => {
  const supportedSpokenLanguages: Array<keyof SpokenLanguageStrings> = [
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
  const supportedCaptionLanguages: Array<keyof CaptionLanguageStrings> = [
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
    'nl'
  ];
  const currentSpokenLanguage = 'en-us';
  const currentCaptionLanguage = 'en';
  const [showModal, setShowModal] = useState<boolean>(false);
  const onDismissCaptionsSettings = (): void => {
    setShowModal(false);
  };
  const onSetSpokenLanguage = (language: any): Promise<void> => {
    console.log(`Spoken language set to ${language}`);
    return Promise.resolve();
  };

  const onSetCaptionLanguage = (language: any): Promise<void> => {
    console.log(`Caption language set to ${language}`);
    return Promise.resolve();
  };

  const onStartCaptions = (): Promise<void> => {
    return Promise.resolve();
  };

  return (
    <Stack>
      <PrimaryButton
        className={mergeStyles({ maxWidth: '13.5rem' })}
        onClick={() => {
          setShowModal(true);
        }}
      >
        {'Captions Settings Modal'}
      </PrimaryButton>
      <CaptionsSettingsModalComponent
        showModal={showModal}
        isCaptionsFeatureActive
        supportedSpokenLanguages={supportedSpokenLanguages}
        supportedCaptionLanguages={supportedCaptionLanguages}
        currentSpokenLanguage={currentSpokenLanguage}
        currentCaptionLanguage={currentCaptionLanguage}
        onSetSpokenLanguage={onSetSpokenLanguage}
        onSetCaptionLanguage={onSetCaptionLanguage}
        onStartCaptions={onStartCaptions}
        onDismissCaptionsSettings={onDismissCaptionsSettings}
        changeCaptionLanguage
      />{' '}
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const CaptionsSettingsModal = CaptionsSettingsModalStory.bind({});
