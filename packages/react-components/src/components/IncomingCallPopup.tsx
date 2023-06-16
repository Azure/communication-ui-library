// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton } from '@fluentui/react';

/**
 * @internal
 */
export type IncomingCallPopupProps = {
  incomingCalls?: {
    id: string;
    callInfo: {
      id?: string;
      displayName?: string;
    };
    startTime: Date;
    endTime?: Date;
  }[];
  onAcceptIncomingCall: (incomingCallId: string) => Promise<void>;
};

const modalPropsStyles = { main: { position: 'absolute', bottom: '1rem', right: '1rem', maxWidth: 450 } };
const modalProps = {
  styles: modalPropsStyles,
  isModeless: true
};
/**
 * @internal
 */
export const IncomingCallPopup = (props: IncomingCallPopupProps): JSX.Element => {
  const showDialog = !!props.incomingCalls?.length;
  const callToPop = props.incomingCalls?.at(0);

  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Incoming Call',
    subText: `${callToPop?.callInfo.displayName ?? 'unknown'} is calling you...`
  };
  return showDialog ? (
    <Dialog hidden={false} dialogContentProps={dialogContentProps} modalProps={modalProps}>
      <DialogFooter>
        <PrimaryButton onClick={() => callToPop?.id && props.onAcceptIncomingCall(callToPop?.id)} text="Accept" />
        <DefaultButton text="Reject" />
      </DialogFooter>
    </Dialog>
  ) : (
    <></>
  );
};
