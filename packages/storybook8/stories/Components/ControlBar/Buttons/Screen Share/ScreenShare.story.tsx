// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ScreenShareButton } from '@azure/communication-react';
import React from 'react';

const ScreenShareStory = (args: any): JSX.Element => {
  return <ScreenShareButton {...args} />;
};

export const ScreenShare = ScreenShareStory.bind({});
