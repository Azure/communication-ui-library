// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { useState } from 'react';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { useMemo } from 'react';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { Dialpad, DialpadStyles, _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { IButtonStyles, IModalStyles, Modal, Stack, useTheme, Text, IconButton, PrimaryButton } from '@fluentui/react';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { Call20Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(PeoplePaneDropdown) */
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
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const { strings, isMobile, isModalOpen, hideModal } = props;
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const [textfieldInput, setTextfieldInput] = useState('');
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const theme = useTheme();
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const onLightDismissTriggered = (): void => hideModal();
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const onChange = (input: string): void => {
    setTextfieldInput(input);
  };
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const onClickCall = (): void => {
    //place holder for adding calling functionality
    console.log(textfieldInput);
  };
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const dialpadModelStyle: Partial<IModalStyles> = useMemo(
    () => ({
      main: {
        borderRadius: theme.effects.roundedCorner6,
        padding: '1rem'
      }
    }),
    [theme.effects.roundedCorner6]
  );
  /* @conditional-compile-remove(PeoplePaneDropdown) */
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
  /* @conditional-compile-remove(PeoplePaneDropdown) */
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
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  if (isMobile) {
    return (
      <Stack>
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
      </Stack>
    );
  }

  return (
    <>
      {
        /* @conditional-compile-remove(PeoplePaneDropdown) */
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
      }
    </>
  );
};
