// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import { Dialpad, DialpadStyles } from '@internal/react-components';
import { _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';
import { IModalStyles, Modal, Stack, useTheme, Text, IconButton } from '@fluentui/react';
import { IButtonStyles, PrimaryButton } from '@fluentui/react';

import { themedDialpadModelStyle } from './PreparedDialpad.styles';
import { themedCallButtonStyle, themedDialpadStyle } from './PreparedDialpad.styles';
/* @conditional-compile-remove(PSTN-calls) */
import { CallWithChatCompositeIcon } from './icons';
import { drawerContainerStyles } from '../CallWithChatComposite/styles/CallWithChatCompositeStyles';

/** @private */
export interface PreparedDialpadStrings {
  dialpadModalAriaLabel: string;
  dialpadModalTitle: string;
  dialpadCloseModalButtonAriaLabel: string;
  dialpadStartCallButtonLabel: string;
}

/** @private */
export interface PreparedDialpadProps {
  isMobile: boolean;
  showDialpad: boolean;
  strings: PreparedDialpadStrings;
  onDismissDialpad: () => void;
}

/** @private */
export const PreparedDialpad = (props: PreparedDialpadProps): JSX.Element => {
  const { strings, isMobile, showDialpad, onDismissDialpad } = props;
  const [textFieldInput, setTextFieldInput] = useState('');

  const theme = useTheme();

  const onDismissTriggered = (): void => {
    setTextFieldInput('');
    onDismissDialpad();
  };

  const onClickCall = (): void => {
    //place holder for adding calling functionality
    console.log(textFieldInput);
  };

  const dialpadModelStyle: Partial<IModalStyles> = useMemo(() => themedDialpadModelStyle(theme), [theme]);

  const dialpadStyle: Partial<DialpadStyles> = useMemo(() => themedDialpadStyle(isMobile, theme), [theme, isMobile]);

  const callButtonStyle: Partial<IButtonStyles> = useMemo(() => themedCallButtonStyle(theme), [theme]);

  const dialpadComponent = (): JSX.Element => {
    return (
      <>
        <Dialpad onChange={setTextFieldInput} styles={dialpadStyle} />
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
          <Stack styles={drawerContainerStyles}>
            <_DrawerSurface onLightDismiss={onDismissTriggered}>
              <Stack style={{ padding: '16px' }}>{dialpadComponent()}</Stack>
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
          styles={dialpadModelStyle}
          data-ui-id="call-with-chat-composite-dialpad"
        >
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <Text style={{ fontWeight: theme.fonts.medium.fontWeight }}>{strings.dialpadModalTitle}</Text>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel={strings.dialpadCloseModalButtonAriaLabel}
              onClick={onDismissTriggered}
              style={{ color: 'black' }}
            />
          </Stack>

          <Stack>{dialpadComponent()}</Stack>
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
