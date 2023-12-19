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
import { Panel, PanelType, PrimaryButton, Stack } from '@fluentui/react';
/* @conditional-compile-remove(end-of-call-survey) */
import { SurveyPaneContent } from './SurveyPaneContent';
/* @conditional-compile-remove(end-of-call-survey) */
import { CallSurveyImprovementSuggestions } from '@internal/react-components';

/** @private */
export const SurveyPane = (props: {
  /* @conditional-compile-remove(end-of-call-survey) */
  onSubmitSurvey?: (survey: CallSurvey) => Promise<CallSurveyResponse | undefined>;
  /* @conditional-compile-remove(end-of-call-survey) */
  onSurveySubmittedCustom?: (
    callId: string,
    surveyId: string,
    /**
     * This is the survey results containing star survey data and API tag survey data.
     * This part of the result will always be sent to the calling sdk
     * This callback provides user with the ability to gain access to survey data
     */
    submittedSurvey: CallSurvey,
    /**
     * This is the survey results containing free form text
     * This part of the result will not be handled by composites
     * User will need to collect and handle this information 100% on their own
     * Free form text survey is not going to show in the UI if onSurveySubmitted is not populated
     */
    improvementSuggestions: CallSurveyImprovementSuggestions
  ) => Promise<void>;
}): JSX.Element => {
  /* @conditional-compile-remove(end-of-call-survey) */
  const { onSubmitSurvey, onSurveySubmittedCustom } = props;
  /* @conditional-compile-remove(end-of-call-survey) */
  const strings = useLocale().strings.call;
  /* @conditional-compile-remove(end-of-call-survey) */
  const [isOpen, setIsOpen] = useState(true);
  /* @conditional-compile-remove(end-of-call-survey) */
  const [ratings, setRatings] = useState(0);
  /* @conditional-compile-remove(end-of-call-survey) */
  const [issuesSelected, setIssuesSelected] = useState<CallSurvey | undefined>();
  /* @conditional-compile-remove(end-of-call-survey) */
  const [showSubmitFeedbackButton, setShowSubmitFeedbackButton] = useState(false);
  /* @conditional-compile-remove(end-of-call-survey) */
  const [improvementSuggestions, setImprovementSuggestions] = useState<CallSurveyImprovementSuggestions>({});
  /* @conditional-compile-remove(end-of-call-survey) */
  const onRenderFooterContent = React.useCallback(
    () => (
      <>
        {showSubmitFeedbackButton && (
          <Stack style={{ borderTop: 'solid', borderTopColor: 'lightgrey' }} horizontalAlign="end">
            <PrimaryButton
              style={{ marginTop: '1rem' }}
              onClick={() => {
                const surveyResults: CallSurvey = { overallRating: { score: ratings } };
                if (issuesSelected?.overallRating) {
                  surveyResults.overallRating = { score: ratings, issues: issuesSelected.overallRating.issues };
                }
                if (issuesSelected?.audioRating) {
                  surveyResults.audioRating = { score: ratings, issues: issuesSelected.audioRating.issues };
                }
                if (issuesSelected?.screenshareRating) {
                  surveyResults.screenshareRating = { score: ratings, issues: issuesSelected.screenshareRating.issues };
                }
                if (issuesSelected?.videoRating) {
                  surveyResults.videoRating = { score: ratings, issues: issuesSelected.videoRating.issues };
                }
                if (onSubmitSurvey) {
                  onSubmitSurvey(surveyResults)
                    .then((res) => {
                      if (onSurveySubmittedCustom) {
                        onSurveySubmittedCustom(
                          res?.callId ?? '',
                          res?.id ?? '',
                          surveyResults,
                          improvementSuggestions
                        );
                      }
                    })
                    .catch((e) => console.log('error when submitting survey: ' + e));
                }
                setIsOpen(false);
              }}
            >
              {strings.surveyConfirmButtonLabel}
            </PrimaryButton>
          </Stack>
        )}
      </>
    ),
    [
      showSubmitFeedbackButton,
      ratings,
      issuesSelected,
      onSubmitSurvey,
      strings.surveyConfirmButtonLabel,
      onSurveySubmittedCustom,
      improvementSuggestions
    ]
  );
  /* @conditional-compile-remove(end-of-call-survey) */
  return (
    <Panel
      headerText={strings.surveyQuestion}
      isOpen={isOpen}
      onDismiss={() => setIsOpen(false)}
      closeButtonAriaLabel={strings.surveyCancelButtonAriaLabel}
      type={PanelType.custom}
      customWidth="24rem"
      onRenderFooterContent={onRenderFooterContent}
      isFooterAtBottom
    >
      <SurveyPaneContent
        setShowSubmitFeedbackButton={(showButton: boolean) => {
          setShowSubmitFeedbackButton(showButton);
        }}
        setRatings={(rating: number) => {
          setRatings(rating);
        }}
        setIssuesSelected={(issuesSelected: CallSurvey) => {
          setIssuesSelected(issuesSelected);
        }}
        setImprovementSuggestions={
          onSurveySubmittedCustom
            ? (improvementSuggestions: CallSurveyImprovementSuggestions) => {
                setImprovementSuggestions(improvementSuggestions);
              }
            : undefined
        }
      />
    </Panel>
  );
  return <></>;
};
