// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IModalStyles, IStackStyles, ITextStyles, Link, Modal, PrimaryButton, Stack, Text } from '@fluentui/react';
import React from 'react';
import { AlertIcon } from './AlertIcon';

/** private */
export interface PermissionsDeniedProps {
  isOpen: boolean;
  onDismiss?: () => void;
}

// quick hack
const desktopWidth = '858px';
const desktopBodyHeight = '480px';

/** private */
export const PermissionsDenied = (props: PermissionsDeniedProps): JSX.Element => {
  return (
    <>
      <div id="modal-host" style={{ position: 'absolute' }}></div>
      <Modal
        layerProps={{ hostId: 'modal-host' }}
        isOpen={props.isOpen}
        styles={modalStyles}
        onDismiss={props.onDismiss}
      >
        <NoPermissionContent />
      </Modal>
    </>
  );
};

const NoPermissionContent = (props: { requestPermissions?: () => void }): JSX.Element => (
  <Stack horizontalAlign="center" tokens={{ childrenGap: '1rem' }}>
    <Stack.Item>
      <AlertIcon />
    </Stack.Item>
    <Stack.Item>
      <Stack styles={modalTextStackStyles}>
        <Stack.Item>
          <Text variant="large" styles={modalTextHeaderStyles}>
            Can&apos;t use your camera or microphone
          </Text>
        </Stack.Item>
        <Stack.Item>
          <Text variant="medium">
            Your browser might not have access to your camera or microphone. To fix this, open System Preferences.
          </Text>
        </Stack.Item>
      </Stack>
    </Stack.Item>
    <Stack.Item>
      <PrimaryButton onClick={props.requestPermissions}>Try again</PrimaryButton>
    </Stack.Item>
    <Stack.Item>
      <Link>Need help? Get troubleshooting help</Link>
    </Stack.Item>
  </Stack>
);

const modalTextStackStyles: IStackStyles = {
  root: {
    textAlign: 'center'
  }
};

const modalStyles: Partial<IModalStyles> = {
  main: {
    padding: '1rem',
    borderRadius: '0.5rem',
    maxWidth: '25rem'
  },
  root: {
    width: desktopWidth,
    height: desktopBodyHeight
  }
};

const modalTextHeaderStyles: ITextStyles = {
  root: {
    fontWeight: 600
  }
};
