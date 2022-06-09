// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DtmfTone } from '@azure/communication-calling';
import { Dialpad } from '@azure/communication-react';
import React from 'react';

const onSendDtmfTone = (dtmfTones: DtmfTone): Promise<void> => {
  console.log(dtmfTones);
  return Promise.resolve();
};
const onDisplayDialpadInput = (value: string): string => {
  // if input value is falsy eg if the user deletes the input, then just return
  if (!value) {
    return value;
  }

  // clean the input for any non-digit values.
  const phoneNumber = value.replace(/[^\d*#+]/g, '');

  if (phoneNumber.length <= 4) {
    return phoneNumber;
  } else {
    return `(${phoneNumber.slice(0, 4)}) ${phoneNumber.slice(4, phoneNumber.length)}`;
  }
};
export const CustomDialpadExample: () => JSX.Element = () => {
  return <Dialpad onSendDtmfTone={onSendDtmfTone} onDisplayDialpadInput={onDisplayDialpadInput} />;
};
