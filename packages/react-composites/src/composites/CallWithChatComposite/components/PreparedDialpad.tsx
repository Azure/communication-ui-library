// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
/* @conditional-compile-remove(PSTN-calls) */
import { useState } from 'react';
import { useMemo } from 'react';
/* @conditional-compile-remove(PSTN-calls) */
import { Dialpad, DialpadStyles } from '@internal/react-components';
import { _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';
import { IModalStyles, Modal, Stack, useTheme, Text, IconButton } from '@fluentui/react';
/* @conditional-compile-remove(PSTN-calls) */
import { IButtonStyles, PrimaryButton } from '@fluentui/react';
import { drawerContainerStyles } from '../styles/CallWithChatCompositeStyles';
import { themedDialpadModelStyle } from './PreparedDialpad.styles';
/* @conditional-compile-remove(PSTN-calls) */
import { themedCallButtonStyle, themedDialpadStyle } from './PreparedDialpad.styles';
/* @conditional-compile-remove(PSTN-calls) */
import { CallWithChatCompositeIcon } from '../../common/icons';

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
  /* @conditional-compile-remove(PSTN-calls) */
  const [textFieldInput, setTextFieldInput] = useState('');

  const theme = useTheme();

  const onDismissTriggered = (): void => {
    /* @conditional-compile-remove(PSTN-calls) */
    setTextFieldInput('');
    onDismissDialpad();
  };

  /* @conditional-compile-remove(PSTN-calls) */
  const onClickCall = (): void => {
    //place holder for adding calling functionality
    console.log(textFieldInput);
  };

  const dialpadModelStyle: Partial<IModalStyles> = useMemo(() => themedDialpadModelStyle(theme), [theme]);

  /* @conditional-compile-remove(PSTN-calls) */
  const dialpadStyle: Partial<DialpadStyles> = useMemo(() => themedDialpadStyle(isMobile, theme), [theme, isMobile]);

  /* @conditional-compile-remove(PSTN-calls) */
  const callButtonStyle: Partial<IButtonStyles> = useMemo(() => themedCallButtonStyle(theme), [theme]);

  const dialpadComponent = (): JSX.Element => {
    /* @conditional-compile-remove(PSTN-calls) */
    return (
      <>
        <Dialpad onChange={setTextFieldInput} styles={dialpadStyle} />
        <PrimaryButton
          text={strings.dialpadStartCallButtonLabel}
          onRenderIcon={() => <CallWithChatCompositeIcon iconName="DialpadStartCall" />}
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
      <Stack>
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
        >
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <Text style={{ fontWeight: 600 }}>{strings.dialpadModalTitle}</Text>
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
