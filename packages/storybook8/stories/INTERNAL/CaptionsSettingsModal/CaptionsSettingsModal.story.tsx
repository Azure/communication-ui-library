// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { _CaptionsSettingsModal, _CaptionsSettingsModalStrings } from '@internal/react-components';
import React, { useState } from 'react';

const CaptionsSettingsModalStory = (args: any): JSX.Element => {
  const supportedSpokenLanguages = {
    English: 'English',
    Chinese: 'Chinese',
    Japanese: 'Japanese',
    Korean: 'Korean',
    French: 'French',
    English: 'English',
    Chinese: 'Chinese',
    Japanese: 'Japanese',
    Korean: 'Korean',
    French: 'French',
    English: 'English'
  };

  const currentSpokenLanguage = 'English';
  const [showModal, setShowModal] = useState<boolean>(true);
  const onDismissCaptionsSettings = (): void => {
    setShowModal(false);
  };
  const onSetSpokenLanguage = (language): Promise<void> => {
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
        supportedSpokenLanguages={strings.supportedSpokenLanguages}
        currentSpokenLanguage={currentSpokenLanguage}
        onSetSpokenLanguage={onSetSpokenLanguage}
        onStartCaptions={onStartCaptions}
        onDismissCaptionsSettings={onDismissCaptionsSettings}
        strings={strings}
        supportedCaptionLanguages={[]}
        onSetCaptionLanguage={Promise.resolve}
        currentCaptionLanguage={''}
      />{' '}
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const CaptionsSettingsModal = CaptionsSettingsModalStory.bind({});
