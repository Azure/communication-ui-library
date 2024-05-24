// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DtmfTone } from '@azure/communication-calling';
import { Dialpad, FluentThemeProvider } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React, { useState } from 'react';

export const CustomDialpadExample: (props: { isTouchOnlyDevice?: boolean }) => JSX.Element = (props: {
  isTouchOnlyDevice?: boolean;
}) => {
  const [dtmftone, setDtmftone] = useState('');
  const [buttonValue, setButtonValue] = useState('');
  const [buttonIndex, setButtonIndex] = useState('');
  const [textFieldValue, setTextFieldValue] = useState('');

  const onSendDtmfTone = (dtmfTone: DtmfTone): Promise<void> => {
    setDtmftone(dtmfTone);
    return Promise.resolve();
  };

  const onClickDialpadButton = (buttonValue: string, buttonIndex: number): void => {
    setButtonValue(buttonValue);
    setButtonIndex(buttonIndex.toString());
  };

  const onChange = (input: string): void => {
    // if there is already a plus sign at the front remove it
    if (input[0] === '+') {
      input = input.slice(1, input.length);
    }
    // add + sign and brackets to format phone number
    if (input.length < 4 && input.length > 0) {
      // store the new value in textFieldValue and pass it back to dialpad textfield
      setTextFieldValue(`+ ${input}`);
    } else if (input.length >= 4) {
      // store the new value in textFieldValue and pass it back to dialpad textfield
      setTextFieldValue(`+ (${input.slice(0, 3)}) ${input.slice(3, input.length)}`);
    } else {
      // store the new value in textFieldValue and pass it back to dialpad textfield
      setTextFieldValue(input);
    }
  };

  return (
    <FluentThemeProvider>
      <Stack>
        <div style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Segoe UI' }}>DTMF Tone: {dtmftone}</div>
        <div style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Segoe UI' }}>
          Button Clicked: {buttonValue} index at {buttonIndex}
        </div>

        <Dialpad
          onSendDtmfTone={onSendDtmfTone}
          textFieldValue={textFieldValue}
          onClickDialpadButton={onClickDialpadButton}
          onChange={onChange}
          disableDtmfPlayback={true}
          longPressTrigger={props.isTouchOnlyDevice ? 'touch' : 'mouseAndTouch'}
        />
      </Stack>
    </FluentThemeProvider>
  );
};
