// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IModalStyles, IStackStyles, ITextStyles, Link, Modal, Stack, Text } from '@fluentui/react';
import React from 'react';
import { CameraSparkleMicrophone } from './CameraSparkleMicrophone';

/** private */
export interface EnablePermissionsPleaseProps {
  isOpen: boolean;
  onDismiss?: () => void;
}

// quick hack
const desktopWidth = '858px';
const desktopBodyHeight = '480px';

/** private */
export const EnablePermissionsPlease = (props: EnablePermissionsPleaseProps): JSX.Element => {
  return (
    <>
      <div id="modal-host" style={{ position: 'absolute' }}></div>
      <Modal
        layerProps={{ hostId: 'modal-host' }}
        isOpen={props.isOpen}
        styles={modalStyles}
        onDismiss={props.onDismiss}
      >
        <RequestPermissionContent />
      </Modal>
    </>
  );
};

const RequestPermissionContent = (): JSX.Element => (
  <Stack horizontalAlign="center" tokens={{ childrenGap: '1rem' }}>
    <Stack.Item>
      <CameraSparkleMicrophone />
    </Stack.Item>
    <Stack.Item>
      <Stack styles={requestModalTextStackStyles}>
        <Stack.Item>
          <Text variant="large" styles={modalTextHeaderStyles}>
            Allow [app name] to use your camera and microphone
          </Text>
        </Stack.Item>
        <Stack.Item>
          <Text variant="medium">This is so participants can see and hear you.</Text>
        </Stack.Item>
      </Stack>
    </Stack.Item>
    <Stack.Item>
      <Link>Need help? Get troubleshooting help</Link>
    </Stack.Item>
  </Stack>
);

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

const requestModalTextStackStyles: IStackStyles = {
  root: {
    textAlign: 'center',
    paddingLeft: '1rem',
    paddingRight: '1rem'
  }
};

const modalTextHeaderStyles: ITextStyles = {
  root: {
    fontWeight: 600
  }
};
