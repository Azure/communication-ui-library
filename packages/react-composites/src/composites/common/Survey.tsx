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
import { Text, PrimaryButton, Stack, useTheme, DefaultButton } from '@fluentui/react';
/* @conditional-compile-remove(end-of-call-survey) */
import { SurveyContent } from './SurveyContent';
/* @conditional-compile-remove(end-of-call-survey) */
import { CallSurveyImprovementSuggestions } from '@internal/react-components';
/* @conditional-compile-remove(end-of-call-survey) */
import { _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(end-of-call-survey) */
import { CallCompositeIcons } from './icons';
/* @conditional-compile-remove(end-of-call-survey) */
import { NoticePage } from '../CallComposite/pages/NoticePage';
/* @conditional-compile-remove(end-of-call-survey) */
import { ThankYouForFeedbackPage } from '../CallComposite/pages/ThankYouForFeedbackPage';
/* @conditional-compile-remove(end-of-call-survey) */
import { questionTextStyle, surveyContainerStyle } from './styles/Survey.styles';

/** @private */
export const Survey = (props: {
  /* @conditional-compile-remove(end-of-call-survey) */
  iconName?: keyof CallCompositeIcons;
  /* @conditional-compile-remove(end-of-call-survey) */
  title: string;
  /* @conditional-compile-remove(end-of-call-survey) */
  moreDetails?: string;
  /* @conditional-compile-remove(end-of-call-survey) */
  disableStartCallButton?: boolean;
  /* @conditional-compile-remove(end-of-call-survey) */
  isMobile?: boolean;
  /* @conditional-compile-remove(end-of-call-survey) */
  onSubmitSurvey?: (survey: CallSurvey) => Promise<CallSurveyResponse | undefined>;
  /* @conditional-compile-remove(end-of-call-survey) */
  /**
   * Optional callback to redirect users to custom screens when survey is done, note that default end call screen will be shown if this callback is not provided
   * This callback can be used to redirect users to different screens depending on survey state, whether it is submitted, skipped or has a problem when submitting the survey
   */
  onSurveyClosed?: (surveyState: 'sent' | 'skipped' | 'error', surveyError?: string) => void;
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
  const {
    onSubmitSurvey,
    onSurveySubmittedCustom,
    onSurveyClosed,
    iconName,
    title,
    moreDetails,
    disableStartCallButton,
    isMobile
  } = props;
  /* @conditional-compile-remove(end-of-call-survey) */
  const strings = useLocale().strings.call;
  /* @conditional-compile-remove(end-of-call-survey) */
  const [ratings, setRatings] = useState(0);
  /* @conditional-compile-remove(end-of-call-survey) */
  const [issuesSelected, setIssuesSelected] = useState<CallSurvey | undefined>();
  /* @conditional-compile-remove(end-of-call-survey) */
  const [showSubmitFeedbackButton, setShowSubmitFeedbackButton] = useState(false);
  /* @conditional-compile-remove(end-of-call-survey) */
  const [improvementSuggestions, setImprovementSuggestions] = useState<CallSurveyImprovementSuggestions>({});

  /* @conditional-compile-remove(end-of-call-survey) */
  const [showDefaultAfterSubmitScreen, setShowDefaultAfterSubmitScreen] = useState<boolean>(false);

  /* @conditional-compile-remove(end-of-call-survey) */
  const [showDefaultAfterDismissedScreen, setShowDefaultAfterDismissedScreen] = useState<boolean>(false);

  /* @conditional-compile-remove(end-of-call-survey) */
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState<boolean>(false);

  /* @conditional-compile-remove(end-of-call-survey) */
  const theme = useTheme();

  /* @conditional-compile-remove(end-of-call-survey) */
  return (
    <>
      {showDefaultAfterSubmitScreen && <ThankYouForFeedbackPage iconName={iconName} />}
      {showDefaultAfterDismissedScreen && (
        <NoticePage
          iconName={iconName}
          title={title}
          moreDetails={moreDetails}
          dataUiId={'left-call-page'}
          disableStartCallButton={disableStartCallButton}
        />
      )}
      {!showDefaultAfterSubmitScreen && !showDefaultAfterDismissedScreen && (
        <Stack verticalAlign="center" className={surveyContainerStyle(!!isMobile)}>
          <Text className={questionTextStyle(theme)}>{strings.surveyTitle}</Text>
          <SurveyContent
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
          <Stack horizontal horizontalAlign="end">
            <DefaultButton
              style={{ marginTop: '1rem', marginRight: '0.5rem' }}
              onClick={() => {
                if (onSurveyClosed) {
                  onSurveyClosed('skipped');
                } else {
                  setShowDefaultAfterDismissedScreen(true);
                }
              }}
            >
              {strings.surveySkipButtonLabel}
            </DefaultButton>

            {showSubmitFeedbackButton && (
              <PrimaryButton
                disabled={submitButtonDisabled}
                style={{ marginTop: '1rem', marginLeft: '0.5rem' }}
                onClick={async () => {
                  const surveyResults: CallSurvey = { overallRating: { score: ratings } };
                  if (issuesSelected?.overallRating) {
                    surveyResults.overallRating = { score: ratings, issues: issuesSelected.overallRating.issues };
                  }
                  if (issuesSelected?.audioRating) {
                    surveyResults.audioRating = { score: ratings, issues: issuesSelected.audioRating.issues };
                  }
                  if (issuesSelected?.screenshareRating) {
                    surveyResults.screenshareRating = {
                      score: ratings,
                      issues: issuesSelected.screenshareRating.issues
                    };
                  }
                  if (issuesSelected?.videoRating) {
                    surveyResults.videoRating = { score: ratings, issues: issuesSelected.videoRating.issues };
                  }
                  if (onSubmitSurvey) {
                    // disable submit button while waiting for the survey to submit
                    setSubmitButtonDisabled(true);
                    // submitting survey results to calling
                    onSubmitSurvey(surveyResults)
                      .then((res) => {
                        // if contoso provided callback to handle their own survey data, send over the submitted survey results
                        if (onSurveySubmittedCustom) {
                          onSurveySubmittedCustom(
                            res?.callId ?? '',
                            res?.id ?? '',
                            surveyResults,
                            improvementSuggestions
                          ).then(() => setSubmitButtonDisabled(false));
                        } else {
                          // if callback is not provided, enable the submit button after survey is submitted
                          setSubmitButtonDisabled(false);
                        }

                        // redirect to new screen
                        if (onSurveyClosed) {
                          // redirect to new screen according to contoso's callback set up
                          onSurveyClosed('sent');
                        } else {
                          // if call back not provided, redirect to default screen
                          setShowDefaultAfterSubmitScreen(true);
                        }
                      })
                      .catch((e) => {
                        // if there is an error submitting the survey, log the error in the console
                        console.log('error when submitting survey: ' + e);
                        // if contoso provided redirect callback, pass contoso the error so they can redirect to a corresponding error screen
                        if (onSurveyClosed) {
                          onSurveyClosed('error', e);
                        }
                      });
                  }
                }}
              >
                {strings.surveyConfirmButtonLabel}
              </PrimaryButton>
            )}
          </Stack>
        </Stack>
      )}
    </>
  );
  return <></>;
};
