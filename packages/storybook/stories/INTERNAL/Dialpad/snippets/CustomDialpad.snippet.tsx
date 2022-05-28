// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DtmfTone } from '@azure/communication-calling';
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
  defaultText: 'Enter a number'
};

const primaryContentToDtmfMapping = {
  '0': 'Num0',
  '+': 'Plus',
  '2': 'Num2',
  '*': 'Star',
  '#': 'Pound'
};

const onSendDtmfTones = (dtmfTones: DtmfTone) => {
  console.log(dtmfTones);
  return Promise.resolve();
};
const onDisplayDialpadInput = (value: string) => {
  // if input value is falsy eg if the user deletes the input, then just return
  if (!value) {
    return value;
  }

  // clean the input for any non-digit values.
  let phoneNumber = value.replace(/[^\d*#+]/g, '');

  if (phoneNumber.length <= 4) {
    return phoneNumber;
  } else {
    return `(${phoneNumber.slice(0, 4)}) ${phoneNumber.slice(4, phoneNumber.length)}`;
  }
};
export const CustomDialpadExample: () => JSX.Element = () => {
  return (
    <_Dialpad
      dialpadButtons={dialPadButtons}
      strings={dialpadStrings}
      primaryContentToDtmfMapping={primaryContentToDtmfMapping}
      onSendDtmfTones={onSendDtmfTones}
      onDisplayDialpadInput={onDisplayDialpadInput}
    />
  );
};
