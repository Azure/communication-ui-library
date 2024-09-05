// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { EndCallButton } from '@azure/communication-react';
import React from 'react';

const EndCallStory = (args: any): JSX.Element => {
  return <EndCallButton {...args} />;
};

export const EndCall = EndCallStory.bind({});
