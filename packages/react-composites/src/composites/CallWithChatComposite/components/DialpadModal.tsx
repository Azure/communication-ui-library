// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
/* @conditional-compile-remove(control-bar-button-injection) */
import { useMemo } from 'react';
import { Dialpad, DialpadStyles, _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';

import { IButtonStyles, IModalStyles, Modal, Stack, useTheme, Text, IconButton, PrimaryButton } from '@fluentui/react';
import { Call20Regular } from '@fluentui/react-icons';
import { drawerContainerStyles } from '../styles/CallWithChatCompositeStyles';

/** @private */
export interface DialpadModalStrings {
  dialpadModalAriaLabel: string;
  DialpadModalTitle: string;
  closeModalButtonAriaLabel: string;
  callButtonLabel: string;
}

/** @private */
export interface DialpadModalProps {
  isMobile: boolean;
  isModalOpen: boolean;
  strings: DialpadModalStrings;
  hideModal: () => void;
}

/** @private */
export const DialpadModal = (props: DialpadModalProps): JSX.Element => {
  const { strings, isMobile, isModalOpen, hideModal } = props;

  const [textfieldInput, setTextfieldInput] = useState('');

  const theme = useTheme();
  const onLightDismissTriggered = (): void => hideModal();
  const onChange = (input: string): void => {
    setTextfieldInput(input);
  };

  const onClickCall = (): void => {
    //place holder for adding calling functionality
    console.log(textfieldInput);
  };

  const dialpadModelStyle: Partial<IModalStyles> = useMemo(
    () => ({
      main: {
        borderRadius: theme.effects.roundedCorner6,
        padding: '1rem'
      }
    }),
    [theme.effects.roundedCorner6]
  );

  const dialpadStyle: Partial<DialpadStyles> = useMemo(
    () => ({
      root: {
        padding: 0,
        marginLeft: 0,
        marginRight: 0,
        maxWidth: '100%'
      },
      textField: {
        root: {
          borderBottom: '1px solid lightgrey'
        },
        field: {
          backgroundColor: 'white',
          fontSize: '1.125rem',
          padding: '1.063rem 0.5rem',
          textAlign: isMobile ? 'center' : 'left',
          paddingTop: 0
        }
      },
      primaryContent: {
        color: theme.palette.themeDarkAlt
      }
    }),
    [theme.palette.themeDarkAlt, isMobile]
  );

  const callButtonStyle: IButtonStyles = {
    root: {
      fontWeight: 600,
      fontSize: '0.875rem', // 14px
      width: '100%',
      height: '2.5rem',
      borderRadius: 3,
      padding: '0.625rem'
    },
    textContainer: {
      display: 'contents'
    }
  };

  if (isMobile) {
    return (
      <>
        {isModalOpen && (
          <Stack styles={drawerContainerStyles}>
            <_DrawerSurface onLightDismiss={onLightDismissTriggered}>
              <Stack style={{ padding: '16px' }}>
                <Dialpad onChange={onChange} styles={dialpadStyle} />
                <PrimaryButton
                  text={strings.callButtonLabel}
                  onRenderIcon={() => <Call20Regular />}
                  onClick={onClickCall}
                  styles={callButtonStyle}
                  disabled={textfieldInput === ''}
                />
              </Stack>
            </_DrawerSurface>
          </Stack>
        )}
      </>
    );
  }

  return (
    <Modal
      titleAriaId={strings.dialpadModalAriaLabel}
      isOpen={isModalOpen}
      onDismiss={hideModal}
      isBlocking={true}
      styles={dialpadModelStyle}
    >
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text style={{ fontWeight: 600 }}>{strings.DialpadModalTitle}</Text>
        <IconButton
          iconProps={{ iconName: 'Cancel' }}
          ariaLabel={strings.closeModalButtonAriaLabel}
          onClick={hideModal}
          style={{ color: 'black' }}
        />
      </Stack>

      <Stack>
        <Dialpad onChange={onChange} styles={dialpadStyle} />
        <PrimaryButton
          text={strings.callButtonLabel}
          onRenderIcon={() => <Call20Regular />}
          onClick={onClickCall}
          styles={callButtonStyle}
          disabled={textfieldInput === ''}
        />
      </Stack>
    </Modal>
  );
};
