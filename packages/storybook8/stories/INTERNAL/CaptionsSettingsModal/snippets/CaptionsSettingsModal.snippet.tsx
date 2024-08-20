// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import {
  _CaptionsSettingsModal,
  _CaptionsSettingsModalStrings,
  SpokenLanguageStrings
} from '@internal/react-components';
import React, { useState } from 'react';

export const CaptionsSettingsModalStory = (args: any): JSX.Element => {
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

  const currentSpokenLanguage = 'en-us';
  const [showModal, setShowModal] = useState<boolean>(true);
  const onDismissCaptionsSettings = (): void => {
    setShowModal(false);
  };
  const onSetSpokenLanguage = (language: any): Promise<void> => {
    alert(`Selected ${language}`);
    return Promise.resolve();
  };

  const onStartCaptions = (): Promise<void> => {
    alert(`Start Captions with selected language`);
    return Promise.resolve();
  };

  const strings = {
    startCaptionsButtonTooltipOffContent: 'Turn on captions',
    captionsSettingsModalTitle: 'What language is being spoken?',
    captionsSettingsDropdownLabel: 'Spoken language',
    captionsSettingsDropdownInfoText: 'Language that everyone on this call is speaking.',
    captionsSettingsConfirmButtonLabel: 'Confirm',
    captionsSettingsCancelButtonLabel: 'Cancel',
    captionsSettingsModalAriaLabel: 'Captions Setting Modal',
    captionsSettingsCloseModalButtonAriaLabel: 'Close Captions Setting'
  };

  return (
    <Stack>
      <_CaptionsSettingsModal
        showModal={showModal}
        isCaptionsFeatureActive={args.isCaptionsFeatureActive}
        supportedSpokenLanguages={supportedSpokenLanguages}
        currentSpokenLanguage={currentSpokenLanguage}
        onSetSpokenLanguage={onSetSpokenLanguage}
        onStartCaptions={onStartCaptions}
        onDismissCaptionsSettings={onDismissCaptionsSettings}
        strings={strings}
        supportedCaptionLanguages={[]}
        onSetCaptionLanguage={Promise.resolve}
        currentCaptionLanguage={'en'}
      />{' '}
    </Stack>
  );
};
