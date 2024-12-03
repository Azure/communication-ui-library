// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PrimaryButton, Stack } from '@fluentui/react';
import { CaptionsInformation, CaptionsBanner as CaptionsBannerComponent } from '@azure/communication-react';
import React, { useState } from 'react';
import {
  GenerateMockNewCaption,
  GenerateMockNewCaptions,
  GenerateMockNewCaptionWithLongName,
  GenerateMockNewShortCaption
} from './mockCaptions';

const CaptionsBannerStory = (): JSX.Element => {
  const [captions, setCaptions] = useState<CaptionsInformation[]>(GenerateMockNewCaptions());

  const addNewCaption = (): void => {
    setCaptions([...captions, GenerateMockNewCaption()]);
  };

  const addNewShortCaption = (): void => {
    setCaptions([...captions, GenerateMockNewShortCaption()]);
  };

  const addNewLongNameCaption = (): void => {
    setCaptions([...captions, GenerateMockNewCaptionWithLongName()]);
  };

  const extendLastCaption = (): void => {
    captions[captions.length - 1].captionText = `${captions[captions.length - 1].captionText} hello`;
    setCaptions([...captions]);
  };

  const containerStyles = {
    width: '100%',
    height: '100%',
    padding: '2rem'
  };

  return (
    <Stack verticalFill tokens={{ childrenGap: '5rem' }} style={containerStyles} verticalAlign="space-between">
      <Stack style={{ border: 'solid grey 0.1rem' }} horizontalAlign="center">
        <Stack.Item style={{ width: '60%' }}>
          <CaptionsBannerComponent captions={captions} isCaptionsOn startCaptionsInProgress />
        </Stack.Item>
      </Stack>

      <Stack horizontal horizontalAlign="space-between">
        <PrimaryButton text="Add new captions" onClick={addNewCaption} />
        <PrimaryButton text="Add new short captions" onClick={addNewShortCaption} />
        <PrimaryButton text="Add new captions with long name" onClick={addNewLongNameCaption} />
        <PrimaryButton text="Extend last caption" onClick={extendLastCaption} />
      </Stack>
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const CaptionsBanner = CaptionsBannerStory.bind({});
