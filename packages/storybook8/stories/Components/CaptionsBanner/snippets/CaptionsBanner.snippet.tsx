// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CaptionsInformation, CaptionsBanner } from '@azure/communication-react';
import { PrimaryButton, Stack } from '@fluentui/react';
import React, { useState } from 'react';
import {
  GenerateMockNewCaption,
  GenerateMockNewCaptions,
  GenerateMockNewCaptionWithLongName,
  GenerateMockNewShortCaption
} from '../mockCaptions';

export const CaptionsBannerStory = (): JSX.Element => {
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
    const caption = captions[captions.length - 1];
    if (caption) {
      caption.captionText = `${caption.captionText} hello`;
      setCaptions([...captions]);
    }
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
          <CaptionsBanner captions={captions} isCaptionsOn startCaptionsInProgress />
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
