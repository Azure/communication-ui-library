// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _Dialpad, _DialpadButtonProps } from '@internal/react-components';
import React from 'react';

const dialPadButtons: _DialpadButtonProps[][] = [
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
    { primaryContent: '2', secondaryContent: '678' },
    { primaryContent: '2', secondaryContent: '098' },
    { primaryContent: '2', secondaryContent: '111' }
  ],
  [
    { primaryContent: '*', secondaryContent: '678' },
    { primaryContent: '0', secondaryContent: '+' },
    { primaryContent: '#', secondaryContent: '678' }
  ]
];

const dialpadStrings = {
  errorText: 'Invalid input {invalidCharacter}. Input must be a numeric chatacter, *, # or +',
  defaultText: 'Enter a number'
};

export const CustomDialpadExample: () => JSX.Element = () => {
  return <_Dialpad dialpadButtons={dialPadButtons} strings={dialpadStrings} />;
};
