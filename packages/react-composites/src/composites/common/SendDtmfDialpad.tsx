// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useState } from 'react';
import { useMemo } from 'react';
import { Dialpad, DialpadStyles } from '@internal/react-components';
import { _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';
import { IModalStyles, Modal, Stack, useTheme, IconButton } from '@fluentui/react';

import { themeddialpadModalStyle, themedDialpadStyle } from './SendDtmfDialpad.styles';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { drawerContainerStyles } from '../CallComposite/styles/CallComposite.styles';

/** @private */
export interface SendDtmfDialpadStrings {
  dialpadModalAriaLabel: string;
  dialpadCloseModalButtonAriaLabel: string;
  placeholderText: string;
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

  const [textFieldValue, setTextFieldValue] = useState<string>();

  const onChange = (input: string): void => {
    if (input.length > 25) {
      setTextFieldValue(input.slice(1));
    } else {
      setTextFieldValue(input);
    }
  };

  const dialpadModalStyle: Partial<IModalStyles> = useMemo(() => themeddialpadModalStyle(theme), [theme]);

  const dialpadStyle: Partial<DialpadStyles> = useMemo(() => themedDialpadStyle(isMobile, theme), [theme, isMobile]);

  if (isMobile) {
    return (
      <Stack>
        {showDialpad && (
          <Stack styles={drawerContainerStyles()}>
            <_DrawerSurface disableMaxHeight={true} onLightDismiss={onDismissTriggered}>
              <Stack style={{ padding: '1rem' }}>
                <Dialpad
                  styles={dialpadStyle}
                  {...dialpadProps}
                  showDeleteButton={false}
                  textFieldValue={textFieldValue}
                  onChange={onChange}
                  strings={strings}
                  isMobile={isMobile}
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
        <Modal
          titleAriaId={strings.dialpadModalAriaLabel}
          isOpen={showDialpad}
          onDismiss={onDismissTriggered}
          isBlocking={true}
          styles={dialpadModalStyle}
        >
          <Stack horizontal horizontalAlign="end" verticalAlign="center">
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel={strings.dialpadCloseModalButtonAriaLabel}
              onClick={onDismissTriggered}
              style={{ color: theme.palette.black }}
            />
          </Stack>

          <Stack style={{ overflow: 'hidden' }}>
            <Dialpad
              styles={dialpadStyle}
              {...dialpadProps}
              textFieldValue={textFieldValue}
              onChange={onChange}
              showDeleteButton={false}
              strings={strings}
              isMobile={isMobile}
            />
          </Stack>
        </Modal>
      }
    </>
  );
};
