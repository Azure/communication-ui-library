// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _CaptionsSettingModal, _CaptionsSettingModalStrings } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';

const CaptionsSettingModalStory = (args): JSX.Element => {
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
  const onDismissCaptionsSetting = (): void => {
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

  return (
    <Stack>
      <_CaptionsSettingModal
        showModal={showModal}
        isCaptionsFeatureActive={args.isCaptionsFeatureActive}
        supportedSpokenLanguages={supportedSpokenLanguages}
        currentSpokenLanguage={currentSpokenLanguage}
        onSetSpokenLanguage={onSetSpokenLanguage}
        onStartCaptions={onStartCaptions}
        onDismissCaptionsSetting={onDismissCaptionsSetting}
      />{' '}
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const CaptionsSettingModal = CaptionsSettingModalStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-CaptionsSettingModal`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/CaptionsSettingModal/CaptionsSettingModal`,
  component: _CaptionsSettingModal,
  argTypes: {
    isCaptionsFeatureActive: controlsToAdd.isCaptionsFeatureActive,
    showModal: hiddenControl,
    supportedSpokenLanguages: hiddenControl,
    currentSpokenLanguage: hiddenControl,
    strings: hiddenControl,
    onSetSpokenLanguage: hiddenControl,
    onDismissCaptionsSetting: hiddenControl,
    onStartCaptions: hiddenControl
  }
} as Meta;
