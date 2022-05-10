// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Dialpad, DialpadButtonsType } from '@azure/communication-react';
import React from 'react';

const dialPadButtons: DialpadButtonsType[][] = [
  [
    { primaryContent: '0' },
    { primaryContent: '0', secondaryContent: '123' },
    { primaryContent: '0', secondaryContent: '456' }
  ],
  [
    { primaryContent: '+', secondaryContent: '789' },
    { primaryContent: '+', secondaryContent: '012' },
    { primaryContent: '+', secondaryContent: '345' }
  ],
  [
    { primaryContent: 'q', secondaryContent: '678' },
    { primaryContent: 'q', secondaryContent: '098' },
    { primaryContent: 'q', secondaryContent: '111' }
  ],
  [
    { primaryContent: '*', secondaryContent: '678' },
    { primaryContent: '0', secondaryContent: '+' },
    { primaryContent: '#', secondaryContent: '678' }
  ]
];

export const CustomDialpadExample: () => JSX.Element = () => {
  return <Dialpad dialpadButtons={dialPadButtons} />;
};
