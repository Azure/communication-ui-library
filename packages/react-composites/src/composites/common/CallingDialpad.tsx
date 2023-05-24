// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import { Dialpad, DialpadStyles } from '@internal/react-components';
import { _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';
import { IModalStyles, Modal, Stack, useTheme, Text, IconButton } from '@fluentui/react';
import { IButtonStyles, PrimaryButton } from '@fluentui/react';

import { themeddialpadModalStyle } from './CallingDialpad.styles';
import { themedCallButtonStyle, themedDialpadStyle } from './CallingDialpad.styles';
/* @conditional-compile-remove(PSTN-calls) */
import { CallWithChatCompositeIcon } from './icons';

import { PhoneNumberIdentifier } from '@azure/communication-common';
import { AddPhoneNumberOptions } from '@azure/communication-calling';
import { drawerContainerStyles } from '../CallComposite/styles/CallComposite.styles';

/** @private */
export interface CallingDialpadStrings {
  dialpadModalAriaLabel: string;
  dialpadModalTitle: string;
  dialpadCloseModalButtonAriaLabel: string;
  dialpadStartCallButtonLabel: string;
}

/** @private */
export interface CallingDialpadProps {
  isMobile: boolean;
  showDialpad: boolean;
  strings: CallingDialpadStrings;
  onDismissDialpad: () => void;
  onAddParticipant: (participant: PhoneNumberIdentifier, options?: AddPhoneNumberOptions) => void;
  alternateCallerId: string;
}

/** @private */
export const CallingDialpad = (props: CallingDialpadProps): JSX.Element => {
  const { strings, isMobile, showDialpad, onDismissDialpad, onAddParticipant, alternateCallerId } = props;
  const [textFieldInput, setTextFieldInput] = useState('');

  const theme = useTheme();

  const onDismissTriggered = (): void => {
    setTextFieldInput('');
    onDismissDialpad();
  };

  const onClickCall = (): void => {
    if (onAddParticipant) {
      /**
       * Format the phone number in dialpad textfield to make sure the phone number is in E.164 format.
       * We assume the input number always include countrycode
       */

      const phoneNumber = { phoneNumber: '+' + textFieldInput.replace(/\D/g, '').replaceAll(' ', '') };

      onAddParticipant(phoneNumber, { alternateCallerId: { phoneNumber: alternateCallerId } });
      onDismissTriggered();
    }
  };

  const dialpadModalStyle: Partial<IModalStyles> = useMemo(() => themeddialpadModalStyle(theme), [theme]);

  const dialpadStyle: Partial<DialpadStyles> = useMemo(() => themedDialpadStyle(isMobile, theme), [theme, isMobile]);

  const callButtonStyle: Partial<IButtonStyles> = useMemo(() => themedCallButtonStyle(theme), [theme]);

  const dialpadComponent = (): JSX.Element => {
    return (
      <>
        <Dialpad styles={dialpadStyle} onChange={setTextFieldInput} isMobile={isMobile} />
        <PrimaryButton
          text={strings.dialpadStartCallButtonLabel}
          onRenderIcon={() => DialpadStartCallIconTrampoline()}
          onClick={onClickCall}
          styles={callButtonStyle}
          disabled={textFieldInput === ''}
        />
      </>
    );

    return <></>;
  };

  if (isMobile) {
    return (
      <Stack data-ui-id="call-with-chat-composite-dialpad">
        {showDialpad && (
          <Stack styles={drawerContainerStyles()}>
            <_DrawerSurface onLightDismiss={onDismissTriggered} disableMaxHeight={false}>
              <Stack style={{ padding: '1rem' }}>{dialpadComponent()}</Stack>
            </_DrawerSurface>
          </Stack>
        )}
      </Stack>
    );
  }

  return (
    <>
      {
        <Modal
          titleAriaId={strings.dialpadModalAriaLabel}
          isOpen={showDialpad}
          onDismiss={onDismissTriggered}
          isBlocking={true}
          styles={dialpadModalStyle}
          data-ui-id="call-with-chat-composite-dialpad"
        >
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <Text>{strings.dialpadModalTitle}</Text>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel={strings.dialpadCloseModalButtonAriaLabel}
              onClick={onDismissTriggered}
              style={{ color: theme.palette.black }}
            />
          </Stack>

          <Stack style={{ overflow: 'hidden' }}>{dialpadComponent()}</Stack>
        </Modal>
      }
    </>
  );
};

function DialpadStartCallIconTrampoline(): JSX.Element {
  /* @conditional-compile-remove(PSTN-calls) */
  return <CallWithChatCompositeIcon iconName="DialpadStartCall" />;
  return <></>;
}
