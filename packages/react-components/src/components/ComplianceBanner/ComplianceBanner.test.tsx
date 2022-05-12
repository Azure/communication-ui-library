// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { act } from 'react-dom/test-utils';
import { initializeIcons, MessageBar } from '@fluentui/react';
import Enzyme, { ReactWrapper, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { _ComplianceBannerStrings } from './types';
import { _ComplianceBanner } from './ComplianceBanner';

describe('ComplianceBanner shows the right message', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    initializeIcons();
  });

  test('when neither recording nor transcribing', () => {
    const root = mountComplianceBannerWithDelayDisabled();
    expect(messageBarPresent(root)).toBeFalsy();
  });

  test('when recording starts', async () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: true, transcribe: false });
    await waitForMessageText(root, strings.complianceBannerRecordingStarted);
    expect(root.text()).toMatch(strings.complianceBannerRecordingStarted);
  });

  test('when transcribing starts', async () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: false, transcribe: true });
    await waitForMessageText(root, strings.complianceBannerTranscriptionStarted);
    expect(root.text()).toMatch(strings.complianceBannerTranscriptionStarted);
  });

  test('when recording and transcribing start', async () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: false, transcribe: true });
    updateBannerProps(root, { record: true, transcribe: true });
    await waitForMessageText(root, strings.complianceBannerRecordingAndTranscriptionStarted);
    expect(root.text()).toMatch(strings.complianceBannerRecordingAndTranscriptionStarted);
  });

  test('when recording and transcribing start and then recording stops', async () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: false, transcribe: true });
    updateBannerProps(root, { record: true, transcribe: true });
    updateBannerProps(root, { record: false, transcribe: true });
    await waitForMessageText(root, strings.complianceBannerRecordingStopped);
    expect(root.text()).toMatch(strings.complianceBannerRecordingStopped);
  });

  test('when recording and transcribing start and then transcribing stops', async () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: false, transcribe: true });
    updateBannerProps(root, { record: true, transcribe: true });
    updateBannerProps(root, { record: true, transcribe: false });
    await waitForMessageText(root, strings.complianceBannerTranscriptionStopped);
    expect(root.text()).toMatch(strings.complianceBannerTranscriptionStopped);
  });

  test('when recording and transcribing start and then stop', async () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: false, transcribe: true });
    updateBannerProps(root, { record: true, transcribe: true });
    updateBannerProps(root, { record: true, transcribe: false });
    updateBannerProps(root, { record: false, transcribe: false });
    await waitForMessageText(root, strings.complianceBannerRecordingAndTranscriptionStopped);
    expect(root.text()).toMatch(strings.complianceBannerRecordingAndTranscriptionStopped);
  });

  test('when recording starts, user dismisses the banner, then transcribing starts', async () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: false, transcribe: true });
    simulateDismissBanner(root);
    expect(messageBarPresent(root)).toBeFalsy();
    updateBannerProps(root, { record: true, transcribe: true });
    await waitForMessageText(root, strings.complianceBannerRecordingAndTranscriptionStarted);
    expect(root.text()).toMatch(strings.complianceBannerRecordingAndTranscriptionStarted);
  });
});

const strings: _ComplianceBannerStrings = {
  close: 'testvalue:close',
  complianceBannerNowOnlyRecording: 'testvalue:complianceBannerNowOnlyRecording',
  complianceBannerNowOnlyTranscription: 'testvalue:complianceBannerNowOnlyTranscription',
  complianceBannerRecordingAndTranscriptionSaved: 'testvalue:complianceBannerRecordingAndTranscriptionSaved',
  complianceBannerRecordingAndTranscriptionStarted: 'testvalue:complianceBannerRecordingAndTranscriptionStarted',
  complianceBannerRecordingAndTranscriptionStopped: 'testvalue:complianceBannerRecordingAndTranscriptionStopped',
  complianceBannerRecordingSaving: 'testvalue:complianceBannerRecordingSaving',
  complianceBannerRecordingStarted: 'testvalue:complianceBannerRecordingStarted',
  complianceBannerRecordingStopped: 'testvalue:complianceBannerRecordingStopped',
  complianceBannerTranscriptionConsent: 'testvalue:complianceBannerTranscriptionConsent',
  complianceBannerTranscriptionSaving: 'testvalue:complianceBannerTranscriptionSaving',
  complianceBannerTranscriptionStarted: 'testvalue:complianceBannerTranscriptionStarted',
  complianceBannerTranscriptionStopped: 'testvalue:complianceBannerTranscriptionStopped',
  learnMore: 'testvalue:learnMore',
  privacyPolicy: 'testvalue:privacyPolicy'
};

const mountComplianceBannerWithDelayDisabled = (): ReactWrapper => {
  let root;
  act(() => {
    root = mount(
      <_ComplianceBanner
        callRecordState={false}
        callTranscribeState={false}
        strings={strings}
        bannerOverwriteDelayMilliseconds={0}
      />
    );
  });
  return root;
};

const updateBannerProps = async (root, props: { record: boolean; transcribe: boolean }): Promise<void> => {
  act(() => {
    root.setProps({ callRecordState: props.record, callTranscribeState: props.transcribe, strings: strings });
  });
  return Promise.resolve();
};

/*
// MessageBar delays rendering messages by calling `setTimeout`.
// `await` the Promise returned by this function to yield to the event loop so that `MessageBar`
// actually renders updated content to the DOM.
const waitForDelayedRender = async (): Promise<void> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      setTimeout(() => {
        setTimeout(resolve);
      });
    })
  );
};
*/

// We will try to look for the message roughly for 5 * 100 = 500 milliseconds.
// The timeout could be longer because of scheduling delays on the event loop,
// but that is not a concern in unittests.
const WAIT_FOR_MESSAGE_RETRY_INTERVAL_MILLISCECONDS = 5;
const WAIT_FOR_MESSAGE_RETRY_LIMIT = 100;

// MessageBar delays rendering messages by calling `setTimeout`.
// This function waits for the given message to be rendered in the `MessageBar`.
//
// This function resolves after a timeout whether or not the message appears. The caller
// should still expect() the message after `await`ing the result of this function.
// Reason: Error messages from synchronous expect() failures tend to be better than
//   any error we can return on timeout.
const waitForMessageText = async (root: ReactWrapper, message: string): Promise<void> => {
  return new Promise((resolve) => {
    // Yield to event loop to allow delayed rendering of MessageBar.
    setTimeout(() => {
      if (root.text().includes(message)) {
        resolve();
        return;
      }
      let retry_count = 0;
      // Infrequently, yielding once isn't enough.
      setInterval(() => {
        if (retry_count > WAIT_FOR_MESSAGE_RETRY_LIMIT) {
          // We resolve the promise even when we fail to find the message.
          // Caller should expect() the message after calling this function.
          resolve();
          return;
        }
        retry_count += 1;

        if (root.text().includes(message)) {
          resolve();
          return;
        }
      }, WAIT_FOR_MESSAGE_RETRY_INTERVAL_MILLISCECONDS);
    });
  });
};

const simulateDismissBanner = (root: ReactWrapper): void => {
  const messageBar = root.find(MessageBar).at(0);
  const button = messageBar.find('button').at(0);
  button.simulate('click');
};

const messageBarPresent = (root: ReactWrapper): boolean => root.exists(MessageBar);
