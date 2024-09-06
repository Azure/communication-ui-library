// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { RaiseHandButton } from '@azure/communication-react';
import React from 'react';

const RaiseHandStory = (args: any): JSX.Element => {
  return <RaiseHandButton {...args} />;
};

export const RaiseHand = RaiseHandStory.bind({});
