// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Checkbox, IStackStyles, IStackTokens, Stack } from '@fluentui/react';
import { _ComplianceBanner as ComplianceBannerComponent } from '@internal/react-components';
import { _useCompositeLocale } from '@internal/react-composites';
import React, { useState } from 'react';

const ComplianceBannerStory = (): JSX.Element => {
  const strings = _useCompositeLocale().strings.call;
  const [callRecordState, setCallRecordState] = useState(true);
  const [callTranscribeState, setCallTranscribeState] = useState(true);
  return (
    <Stack styles={containerStyles} tokens={stackTokens}>
      <Stack horizontal tokens={stackTokens}>
        <Checkbox
          label="Recording is in progress"
          checked={callRecordState}
          onChange={(ev?: unknown, isChecked?: boolean) => setCallRecordState(!!isChecked)}
        />
        <Checkbox
          label="Transcription is in progress"
          checked={callTranscribeState}
          onChange={(ev?: unknown, isChecked?: boolean) => setCallTranscribeState(!!isChecked)}
        />
      </Stack>

      <ComplianceBannerComponent
        callRecordState={callRecordState}
        callTranscribeState={callTranscribeState}
        strings={strings}
      />
    </Stack>
  );
};

const containerStyles: IStackStyles = {
  root: {
    width: '80%',
    height: '80%'
  }
};

const stackTokens: IStackTokens = {
  childrenGap: '1rem'
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const ComplianceBanner = ComplianceBannerStory.bind({});
