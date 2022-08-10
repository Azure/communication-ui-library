// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { useMemo } from 'react';
import { Dialpad, DialpadStrings, DialpadStyles } from '@internal/react-components';
import { _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';
import { IModalStyles, Modal, Stack, useTheme, IconButton } from '@fluentui/react';

import { themedDialpadModelStyle, themedDialpadStyle } from './SendDtmfDialpad.styles';
import { drawerContainerStyles } from '../CallWithChatComposite/styles/CallWithChatCompositeStyles';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';

/** @private */
export interface SendDtmfDialpadStrings {
  dialpadModalAriaLabel: string;
  dialpadCloseModalButtonAriaLabel: string;
}

/** @private */
export interface SendDtmfDialpadProps {
  isMobile: boolean;
  showDialpad: boolean;
  strings: SendDtmfDialpadStrings;
  onDismissDialpad: () => void;
}

/** @private */
export const SendDtmfDialpad = (props: SendDtmfDialpadProps): JSX.Element => {
  const dialpadProps = usePropsFor(Dialpad);

  const { strings, isMobile, showDialpad, onDismissDialpad } = props;

  const theme = useTheme();

  const onDismissTriggered = (): void => {
    onDismissDialpad();
  };

  const dialpadModelStyle: Partial<IModalStyles> = useMemo(() => themedDialpadModelStyle(theme), [theme]);

  const dialpadStyle: Partial<DialpadStyles> = useMemo(() => themedDialpadStyle(isMobile, theme), [theme, isMobile]);

  const dialpadStrings: DialpadStrings = {
    placeholderText: ''
  };

  if (isMobile) {
    return (
      <Stack>
        {showDialpad && (
          <Stack styles={drawerContainerStyles}>
            <_DrawerSurface onLightDismiss={onDismissTriggered}>
              <Stack style={{ padding: '16px' }}>
                {' '}
                <Dialpad styles={dialpadStyle} {...dialpadProps} showDeleteButton={false} />
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
        <Modal
          titleAriaId={strings.dialpadModalAriaLabel}
          isOpen={showDialpad}
          onDismiss={onDismissTriggered}
          isBlocking={true}
          styles={dialpadModelStyle}
        >
          <Stack horizontal horizontalAlign="end" verticalAlign="center">
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel={strings.dialpadCloseModalButtonAriaLabel}
              onClick={onDismissTriggered}
              style={{ color: 'black' }}
            />
          </Stack>

          <Stack>
            {' '}
            <Dialpad styles={dialpadStyle} {...dialpadProps} showDeleteButton={false} strings={dialpadStrings} />
          </Stack>
        </Modal>
      }
    </>
  );
};
