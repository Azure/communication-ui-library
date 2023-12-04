// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(end-of-call-survey) */
import { _captionSettingsSelector } from '@internal/calling-component-bindings';
import { CallSurvey, CallSurveyResponse } from '@azure/communication-calling';
import { Panel, PanelType } from '@fluentui/react';
import { SurveyPaneContent } from './SurveyPaneContent';

/** @private */
export const SurveyPane = (props: {
  onSubmitSurvey?: (survey: CallSurvey) => Promise<CallSurveyResponse | undefined>;
}): JSX.Element => {
  /* @conditional-compile-remove(end-of-call-survey) */
  const strings = useLocale().strings.call;
  const [isOpen, setIsOpen] = useState(true);
  /* @conditional-compile-remove(end-of-call-survey) */
  return (
    <Panel
      headerText={strings.starSurveyQuestion}
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
