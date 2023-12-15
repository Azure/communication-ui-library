// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
import { useState } from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(end-of-call-survey) */
import { CallSurvey, CallSurveyResponse } from '@azure/communication-calling';
/* @conditional-compile-remove(end-of-call-survey) */
import { Panel, PanelType } from '@fluentui/react';
/* @conditional-compile-remove(end-of-call-survey) */
import { SurveyPaneContent } from './SurveyPaneContent';

/** @private */
export const SurveyPane = (props: {
  /* @conditional-compile-remove(end-of-call-survey) */
  onSubmitSurvey?: (survey: CallSurvey) => Promise<CallSurveyResponse | undefined>;
}): JSX.Element => {
  /* @conditional-compile-remove(end-of-call-survey) */
  const strings = useLocale().strings.call;
  /* @conditional-compile-remove(end-of-call-survey) */
  const [isOpen, setIsOpen] = useState(true);
  /* @conditional-compile-remove(end-of-call-survey) */
  return (
    <Panel
      headerText={strings.surveyQuestion}
      isOpen={isOpen}
      onDismiss={() => setIsOpen(false)}
      closeButtonAriaLabel={strings.surveyCancelButtonAriaLabel}
      type={PanelType.custom}
      customWidth="32rem"
    >
      <SurveyPaneContent onSubmitSurvey={props.onSubmitSurvey} onDismissSidePane={() => setIsOpen(false)} />
    </Panel>
  );
  return <></>;
};
