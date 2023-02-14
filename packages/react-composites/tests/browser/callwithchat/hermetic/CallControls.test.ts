// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { loadCallPage, test } from './fixture';
import { expect } from '@playwright/test';
import { dataUiId, pageClick, stableScreenshot } from '../../common/utils';
import type { CallWithChatCompositeOptions } from '../../../../src';
import { defaultMockCallAdapterState, defaultMockRemoteParticipant } from '../../call/hermetic/fixture';

test.describe('Custom call control options tests', () => {
  test('Control bar buttons correctly show as compact with camera disabled and end call button hidden', async ({
    page,
    serverUrl
  }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const testOptions: CallWithChatCompositeOptions = {
      callControls: {
        displayType: 'compact',
        cameraButton: {
          disabled: true
        },
        endCallButton: false,
        microphoneButton: true,
        moreButton: undefined
      }
    };
    const callState = defaultMockCallAdapterState([paul]);
    await loadCallPage(page, serverUrl, callState, {
      customCompositeOptions: JSON.stringify(testOptions)
    });

    expect(await stableScreenshot(page)).toMatchSnapshot(`user-set-control-bar-button-options.png`);
  });

  test('Control bar custom buttons render correctly', async ({ page, serverUrl }) => {
    const paul = defaultMockRemoteParticipant('Paul Bridges');
    const testOptions: CallWithChatCompositeOptions = {
      callControls: {
        cameraButton: false,
        microphoneButton: false,
        screenShareButton: false,
        peopleButton: false,
        chatButton: false,
        onFetchCustomButtonProps: [
          () => ({
            placement: 'primary',
            iconName: 'MessageEdit',
            text: 'Primary Btn 1',
            key: 'primary-button-1',
            onItemClick: () => {
              alert('Primary button 1 clicked!');
            },
            styles: {
              root: {
                background: '#ff6600'
              }
            }
          }),
          () => ({
            placement: 'primary',
            iconName: 'MessageEdit',
            text: 'Primary Btn 2',
            key: 'primary-button-2',
            disabled: true,
            onItemClick: () => {
              alert('Primary button 2 clicked!');
            }
          }),
          () => ({
            placement: 'primary',
            iconName: 'MessageEdit',
            text: 'Primary Btn 3',
            key: 'primary-button-3',
            showLabel: false,
            onItemClick: () => {
              alert('Primary button 3 clicked!');
            }
          }),
          () => ({
            placement: 'primary',
            iconName: 'MessageEdit',
            text: 'Primary Btn 4',
            key: 'primary-button-4',
            disabled: false,
            showLabel: false,
            onItemClick: () => {
              alert('Primary button 4 clicked!');
            }
          }),
          () => ({
            placement: 'primary',
            iconName: 'MessageEdit',
            text: 'Primary Btn 5',
            key: 'primary-button-5',
            disabled: true,
            showLabel: false,
            onItemClick: () => {
              alert('Primary button 4 clicked!');
            }
          }),
          () => ({
            placement: 'secondary',
            iconName: 'MessageRemove',
            text: 'Secondary Btn 1',
            key: 'secondary-button-1',
            disabled: true,
            showLabel: true,
            onItemClick: () => {
              alert('Secondary button 1 clicked!');
            }
          }),
          () => ({
            placement: 'secondary',
            iconName: 'MessageRemove',
            text: 'Secondary Btn 2',
            key: 'secondary-button-2',
            disabled: false,
            showLabel: false,
            onItemClick: () => {
              alert('Secondary button 2 clicked!');
            }
          }),
          () => ({
            placement: 'secondary',
            iconName: 'MessageRemove',
            text: 'Secondary Btn 3',
            key: 'secondary-button-3',
            disabled: false,
            showLabel: false,
            onItemClick: () => {
              alert('Secondary button 3 clicked!');
            }
          }),
          () => ({
            placement: 'overflow',
            iconName: 'SendBoxSend',
            text: 'Overflow Btn 1',
            key: 'overflow-button-1',
            disabled: false,
            showLabel: false,
            onItemClick: () => {
              alert('Overflow button 1 clicked!');
            }
          }),
          () => ({
            placement: 'overflow',
            iconName: 'SendBoxSend',
            text: 'Overflow Btn 2',
            key: 'overflow-button-2',
            disabled: false,
            showLabel: false,
            onItemClick: () => {
              alert('Overflow button 2 clicked!');
            }
          })
        ]
      }
    };
    const callState = defaultMockCallAdapterState([paul]);
    await loadCallPage(page, serverUrl, callState, {
      customCompositeOptions: JSON.stringify(testOptions)
    });

    await pageClick(page, dataUiId('call-with-chat-composite-more-button'));
    expect(await stableScreenshot(page)).toMatchSnapshot(`user-set-control-bar-button-options.png`);
  });
});
