// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _CaptionsSettingsModal, _CaptionsSettingsModalStrings } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';

const CaptionsSettingsModalStory = (args): JSX.Element => {
  const supportedSpokenLanguages = [
    'English',
    'Chinese',
    'Japanese',
    'Korean',
    'French',
    'English',
    'Chinese',
    'Japanese',
    'Korean',
    'French',
    'English',
    'Chinese',
    'Japanese',
    'Korean',
    'French',
    'English',
    'Chinese',
    'Japanese',
    'Korean',
    'French'
  ];
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
        supportedSpokenLanguages={supportedSpokenLanguages}
        currentSpokenLanguage={currentSpokenLanguage}
        onSetSpokenLanguage={onSetSpokenLanguage}
        onStartCaptions={onStartCaptions}
        onDismissCaptionsSettings={onDismissCaptionsSettings}
        strings={strings}
      />{' '}
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const CaptionsSettingsModal = CaptionsSettingsModalStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-CaptionsSettingsModal`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/CaptionsSettingsModal/CaptionsSettingsModal`,
  component: _CaptionsSettingsModal,
  argTypes: {
    isCaptionsFeatureActive: controlsToAdd.isCaptionsFeatureActive,
    showModal: hiddenControl,
    supportedSpokenLanguages: hiddenControl,
    currentSpokenLanguage: hiddenControl,
    strings: hiddenControl,
    onSetSpokenLanguage: hiddenControl,
    onDismissCaptionsSettings: hiddenControl,
    onStartCaptions: hiddenControl
  }
} as Meta;
