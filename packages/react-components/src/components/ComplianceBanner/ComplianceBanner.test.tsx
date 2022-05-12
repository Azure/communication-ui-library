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
    await waitForMessageText(root, strings.complianceBannerTranscriptionStarted);
    simulateDismissBanner(root);
    expect(messageBarPresent(root)).toBeFalsy();
    updateBannerProps(root, { record: true, transcribe: true });
    await waitForMessageText(root, strings.complianceBannerRecordingAndTranscriptionStarted);
    expect(root.text()).toMatch(strings.complianceBannerRecordingAndTranscriptionStarted);
  });
});

const MILLISECONDS_IN_AN_HOUR = 60 * 60 * 1000;

// These tests are a bit slow.
// See reasons in the comments for individual tests.
describe('When messages arrive in succession', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    initializeIcons();
  });

  test('the second message is not shown immediately', async () => {
    const root = mountComplianceBanner();
    // Mounting the component is considered to be a message, so this is the second message:
    updateBannerProps(root, { record: false, transcribe: true });
    // We expect this await to timeout, so keep the retry interval and limit low to keep the test fast.
    await waitForMessageText(root, strings.complianceBannerTranscriptionStarted, 1, 5);
    expect(messageBarPresent(root)).toBeFalsy();
  });

  test('the second message is shown if it arrives after a long time', async () => {
    let now = [Date.now()];
    jest.spyOn(global.Date, 'now').mockImplementation(() => now[0]);
    const root = mountComplianceBanner();

    // Advance fake time so that the next update seems to be after a long time.
    now[0] = now[0] + MILLISECONDS_IN_AN_HOUR;

    // Mounting the component is considered to be a message, so this is the second message:
    updateBannerProps(root, { record: false, transcribe: true });
    await waitForMessageText(root, strings.complianceBannerTranscriptionStarted);
    expect(root.text()).toMatch(strings.complianceBannerTranscriptionStarted);
  });

  test.only('the second message is shown after a delay', async () => {
    jest.useFakeTimers();
    // This test is a bit slow because we wait for the second message to be shown.
    // It is hard to fake time here, because the component internally calls setInterval().
    // We instead compromise by setting a very small value for `bannerOverwriteDelayMilliseconds`.
    const root = mountComplianceBanner({ bannerOverwriteDelayMilliseconds: 300 });

    // Mounting the component is considered to be a message, so this is the second message:
    updateBannerProps(root, { record: false, transcribe: true });
    // Not enough time for the second message to be shown.
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(messageBarPresent(root)).toBeFalsy();

    act(() => {
      jest.runAllTimers();
    });
    act(() => {
      jest.runAllTimers();
    });
    expect(root.text()).toMatch(strings.complianceBannerTranscriptionStarted);
    jest.useRealTimers();
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
  return mountComplianceBanner({ bannerOverwriteDelayMilliseconds: 0 });
};

const mountComplianceBanner = (options?: { bannerOverwriteDelayMilliseconds?: number }): ReactWrapper => {
  let root;
  act(() => {
    root = mount(
      <_ComplianceBanner
        callRecordState={false}
        callTranscribeState={false}
        strings={strings}
        bannerOverwriteDelayMilliseconds={options?.bannerOverwriteDelayMilliseconds}
      />
    );
  });
  return root;
};

const updateBannerProps = (root, props: { record: boolean; transcribe: boolean }): void => {
  act(() => {
    root.setProps({ callRecordState: props.record, callTranscribeState: props.transcribe, strings: strings });
  });
};

// We will try to look for the message roughly for 5 * 100 = 500 milliseconds.
// The timeout could be longer because of scheduling delays on the event loop,
// but that is not a concern in unittests.
const WAIT_FOR_MESSAGE_RETRY_INTERVAL_MILLISCECOND = 5;
const WAIT_FOR_MESSAGE_RETRY_LIMIT = 100;

// MessageBar delays rendering messages by calling `setTimeout`.
// This function waits for the given message to be rendered in the `MessageBar`.
//
// This function resolves after a timeout whether or not the message appears. The caller
// should still expect() the message after `await`ing the result of this function.
// Reason: Error messages from synchronous expect() failures tend to be better than
//   any error we can return on timeout.
const waitForMessageText = async (
  root: ReactWrapper,
  message: string,
  retry_interval_millisecond?: number,
  retry_limit?: number
): Promise<void> => {
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
        if (retry_count > (retry_limit ?? WAIT_FOR_MESSAGE_RETRY_LIMIT)) {
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
      }, retry_interval_millisecond ?? WAIT_FOR_MESSAGE_RETRY_INTERVAL_MILLISCECOND);
    });
  });
};

const simulateDismissBanner = (root: ReactWrapper): void => {
  const messageBar = root.find(MessageBar).at(0);
  console.log(root.html());
  const button = messageBar.find('button').at(0);
  button.simulate('click');
};

const messageBarPresent = (root: ReactWrapper): boolean => root.exists(MessageBar);
