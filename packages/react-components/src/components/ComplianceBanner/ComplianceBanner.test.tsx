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
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('when neither recording nor transcribing', () => {
    const root = mountComplianceBannerWithDelayDisabled();
    expect(messageBarPresent(root)).toBeFalsy();
  });

  test('when recording starts', () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: true, transcribe: false });
    completeMessageBarRender();
    expect(root.text()).toMatch(strings.complianceBannerRecordingStarted);
  });

  test('when transcribing starts', () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: false, transcribe: true });
    completeMessageBarRender();
    expect(root.text()).toMatch(strings.complianceBannerTranscriptionStarted);
  });

  test('when recording and transcribing start', () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: false, transcribe: true });
    updateBannerProps(root, { record: true, transcribe: true });
    completeMessageBarRender();
    expect(root.text()).toMatch(strings.complianceBannerRecordingAndTranscriptionStarted);
  });

  test('when recording and transcribing start and then recording stops', () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: false, transcribe: true });
    updateBannerProps(root, { record: true, transcribe: true });
    updateBannerProps(root, { record: false, transcribe: true });
    completeMessageBarRender();
    expect(root.text()).toMatch(strings.complianceBannerRecordingStopped);
  });

  test('when recording and transcribing start and then transcribing stops', () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: false, transcribe: true });
    updateBannerProps(root, { record: true, transcribe: true });
    updateBannerProps(root, { record: true, transcribe: false });
    completeMessageBarRender();
    expect(root.text()).toMatch(strings.complianceBannerTranscriptionStopped);
  });

  test('when recording and transcribing start and then stop', () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: false, transcribe: true });
    updateBannerProps(root, { record: true, transcribe: true });
    updateBannerProps(root, { record: true, transcribe: false });
    updateBannerProps(root, { record: false, transcribe: false });
    completeMessageBarRender();
    expect(root.text()).toMatch(strings.complianceBannerRecordingAndTranscriptionStopped);
  });

  test('when recording starts, user dismisses the banner, then transcribing starts', () => {
    const root = mountComplianceBannerWithDelayDisabled();
    updateBannerProps(root, { record: false, transcribe: true });
    completeMessageBarRender();
    expect(root.text()).toMatch(strings.complianceBannerTranscriptionStarted);

    simulateDismissBanner(root);
    expect(messageBarPresent(root)).toBeFalsy();

    updateBannerProps(root, { record: true, transcribe: true });
    completeMessageBarRender();
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

const updateBannerProps = (root, props: { record: boolean; transcribe: boolean }): void => {
  act(() => {
    root.setProps({ callRecordState: props.record, callTranscribeState: props.transcribe, strings: strings });
  });
};

// MessageBar delays rendering messages by calling `setTimeout`.
//
// This function runs pending timers to finish MessageBar rendering.
//
// Assumption: The test already called jest.useFakeTimers()
const completeMessageBarRender = () => {
  act(() => {
    jest.runAllTimers();
  });
};

const simulateDismissBanner = (root: ReactWrapper): void => {
  const messageBar = root.find(MessageBar).at(0);
  const button = messageBar.find('button').at(0);
  button.simulate('click');
};

const messageBarPresent = (root: ReactWrapper): boolean => root.exists(MessageBar);
