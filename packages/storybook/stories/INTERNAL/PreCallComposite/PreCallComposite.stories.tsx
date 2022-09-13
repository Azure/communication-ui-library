// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _PreCallComposite as PreCallCompositeComponent } from '@internal/react-composites';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPOSITE_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';
import { DesktopPreviewContainer } from '../../DesktopContainer';

const storyControls = {
  delay: { control: 'number', defaultValue: 0, name: 'Arbitrary delay before displaying modal (ms)' }
};

const PreCallCompositeStory = (args): JSX.Element => {
  return (
    <DesktopPreviewContainer>
      <PreCallCompositeComponent delayMs={args.delay} />
    </DesktopPreviewContainer>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const PreCallComposite = PreCallCompositeStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-internal-precallcomposite`,
  title: `${COMPOSITE_FOLDER_PREFIX}/Internal/PreCallComposite`,
  component: PreCallCompositeComponent,
  argTypes: {
    ...storyControls,
    // hide defaults
    delayMs: hiddenControl
  }
} as Meta;
