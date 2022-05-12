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
    await updateBannerProps(root, { record: true, transcribe: false });
    expect(root.text()).toMatch(strings.complianceBannerRecordingStarted);
  });

  test('when transcribing starts', async () => {
    const root = mountComplianceBannerWithDelayDisabled();
    await updateBannerProps(root, { record: false, transcribe: true });
    expect(root.text()).toMatch(strings.complianceBannerTranscriptionStarted);
  });

  test('when recording and transcribing start', async () => {
    const root = mountComplianceBannerWithDelayDisabled();
    await updateBannerProps(root, { record: false, transcribe: true });
    await updateBannerProps(root, { record: true, transcribe: true });
    expect(root.text()).toMatch(strings.complianceBannerRecordingAndTranscriptionStarted);
  });

  test('when recording and transcribing start and then recording stops', async () => {
    const root = mountComplianceBannerWithDelayDisabled();
    await updateBannerProps(root, { record: false, transcribe: true });
    await updateBannerProps(root, { record: true, transcribe: true });
    await updateBannerProps(root, { record: false, transcribe: true });
    expect(root.text()).toMatch(strings.complianceBannerRecordingStopped);
  });

  test('when recording and transcribing start and then transcribing stops', async () => {
    const root = mountComplianceBannerWithDelayDisabled();
    await updateBannerProps(root, { record: false, transcribe: true });
    await updateBannerProps(root, { record: true, transcribe: true });
    await updateBannerProps(root, { record: true, transcribe: false });
    expect(root.text()).toMatch(strings.complianceBannerTranscriptionStopped);
  });

  test('when recording and transcribing start and then transcribing stops', async () => {
    const root = mountComplianceBannerWithDelayDisabled();
    await updateBannerProps(root, { record: false, transcribe: true });
    await updateBannerProps(root, { record: true, transcribe: true });
    await updateBannerProps(root, { record: true, transcribe: false });
    expect(root.text()).toMatch(strings.complianceBannerTranscriptionStopped);
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
  return waitForDelayedRender();
};

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
/*
const DELAYED_RENDER_WAIT_TIMEOUT_MILLISECONDS = 1000;

const waitForMessageTextToMatch = async (root: ReactWrapper, pattern: string): void => {

}


const simulateDismissBanner = (root: ReactWrapper): void => {
    const messageBar = root.find(MessageBar).at(0);
    const button = messageBar.find('button').at(0);
    button.simulate('click');
};

*/

const messageBarPresent = (root: ReactWrapper): boolean => root.exists(MessageBar);
