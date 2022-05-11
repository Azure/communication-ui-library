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
    const root = mountComplianceBannerWithDefaults();
    expect(messageBarPresent(root)).toBeFalsy();
  });

  test('when recording starts', () => {
    const root = mountComplianceBannerWithDefaults();
    updateBannerProps(root, { record: true, transcribe: false });
    console.log(root.render().html());
    expect(messageBarPresent(root)).toBeTruthy();
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

const mountComplianceBannerWithDefaults = (): ReactWrapper => {
  let root;
  act(() => {
    root = mount(<_ComplianceBanner callRecordState={false} callTranscribeState={false} strings={strings} />);
  });
  return root;
};

const updateBannerProps = (root, props: { record: boolean; transcribe: boolean }): void => {
  act(() => {
    root.setProps({ callRecordState: props.record, callTranscribeState: props.transcribe, strings: strings });
  });
};

/*
const simulateDismissBanner = (root: ReactWrapper): void => {
    const messageBar = root.find(MessageBar).at(0);
    const button = messageBar.find('button').at(0);
    button.simulate('click');
};

*/

const messageBarPresent = (root: ReactWrapper): boolean => root.exists(MessageBar);
