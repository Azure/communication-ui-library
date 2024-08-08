// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { LocalPreviewExample } from './snippets/LocalPreviewExample.snippet';

const LocalPreviewStory = (args): JSX.Element => {
  return <LocalPreviewExample {...args} />;
};

export const LocalPreview = LocalPreviewStory.bind({});
