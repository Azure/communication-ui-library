// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DtmfTone } from '@azure/communication-calling';
import { Dialpad } from '@azure/communication-react';
import React, { useState } from 'react';

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
  const [dtmftone, setDtmftone] = useState('');
  const [buttonValue, setButtonValue] = useState('');
  const [buttonIndex, setButtonIndex] = useState('');
  const [textfieldInput, setTextfieldInput] = useState('');

  const onSendDtmfTone = (dtmfTone: DtmfTone): Promise<void> => {
    setDtmftone(dtmfTone);
    return Promise.resolve();
  };

  const onClickDialpadButton = (buttonValue: string, buttonIndex: number): void => {
    setButtonValue(buttonValue);
    setButtonIndex(buttonIndex.toString());
  };

  const onTextFieldChange = (input: string): void => {
    setTextfieldInput(input);
  };

  return (
    <>
      <div>DTMF Tone: {dtmftone}</div>
      <div>
        Button Clicked: {buttonValue} index at {buttonIndex}
      </div>
      <div>Textfield Input from keyboard: {textfieldInput}</div>
      <Dialpad
        onSendDtmfTone={onSendDtmfTone}
        onDisplayDialpadInput={onDisplayDialpadInput}
        onClickDialpadButton={onClickDialpadButton}
        onTextFieldChange={onTextFieldChange}
      />{' '}
    </>
  );
};
