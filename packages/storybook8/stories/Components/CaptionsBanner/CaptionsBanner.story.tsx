// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CaptionsInformation,
  CaptionsBanner as CaptionsBannerComponent,
  RealTimeTextInformation
} from '@azure/communication-react';
import { PrimaryButton, Stack } from '@fluentui/react';
import React, { useState } from 'react';
import {
  GenerateMockNewCaption,
  GenerateMockNewCaptions,
  GenerateMockNewCaptionWithLongName,
  GenerateMockNewShortCaption
} from './mockCaptions';

const CaptionsBannerStory = (args: any): JSX.Element => {
  const [captions, setCaptions] = useState<CaptionsInformation[]>(GenerateMockNewCaptions());

  const [realTimeTexts, setRealTimeTexts] = useState<RealTimeTextInformation[]>([]);
  const [finalizedRealTimeTexts, setFinalizedRealTimeTexts] = useState<RealTimeTextInformation[]>([]);

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

  const sendRealTimeText = async (text: string, isFinalized: boolean): Promise<void> => {
    if (!isFinalized) {
      setRealTimeTexts([{ message: text, id: 1, displayName: 'John', isTyping: true, finalizedTimeStamp: new Date() }]);
      return Promise.resolve();
    }
    if (isFinalized) {
      setFinalizedRealTimeTexts([
        ...finalizedRealTimeTexts,
        { message: text, id: 1, displayName: 'John', isTyping: false, finalizedTimeStamp: new Date() }
      ]);
      setRealTimeTexts([]);
      return Promise.resolve();
    }
  };

  return (
    <Stack verticalFill tokens={{ childrenGap: '5rem' }} style={containerStyles} verticalAlign="space-between">
      <Stack style={{ border: 'solid grey 0.1rem' }} horizontalAlign="center">
        <Stack.Item style={{ width: '90%' }}>
          <CaptionsBannerComponent
            captions={captions}
            realTimeTexts={{ currentInProgress: realTimeTexts, completedMessages: finalizedRealTimeTexts }}
            onSendRealTimeText={sendRealTimeText}
            isCaptionsOn={args.isCaptionsOn}
            isRealTimeTextOn={args.isRealTimeTextOn}
            startCaptionsInProgress={args.startCaptionsInProgress}
            formFactor={args.formFactor}
          />
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
