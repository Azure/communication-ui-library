// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Dialpad, DialpadButtonsType } from '@azure/communication-react';
import React from 'react';

const dialPadButtons: DialpadButtonsType[][] = [
  [
    { primaryContent: '*' },
    { primaryContent: '*', secondaryContent: 'ABC' },
    { primaryContent: '*', secondaryContent: 'DEF' }
  ],
  [
    { primaryContent: '+', secondaryContent: 'GHI' },
    { primaryContent: '+', secondaryContent: 'JKL' },
    { primaryContent: '+', secondaryContent: 'MNO' }
  ],
  [
    { primaryContent: '7', secondaryContent: 'PQRS' },
    { primaryContent: '8', secondaryContent: 'TUV' },
    { primaryContent: '9', secondaryContent: 'WXYZ' }
  ],
  [{ primaryContent: '*' }, { primaryContent: '0', secondaryContent: '+' }, { primaryContent: '#' }]
];

export const CustomDialpadExample: () => JSX.Element = () => {
  return <Dialpad dialpadButtons={dialPadButtons} />;
};
