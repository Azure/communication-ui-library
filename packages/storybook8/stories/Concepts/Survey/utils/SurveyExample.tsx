// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallSurvey } from '@azure/communication-calling';
import { CallSurveyImprovementSuggestions, DEFAULT_COMPONENT_ICONS } from '@azure/communication-react';
import { Text, PrimaryButton, Stack, Theme, mergeStyles, useTheme } from '@fluentui/react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import React, { useState } from 'react';
import { SurveyContent } from '../../../../../react-composites/src/composites/common/SurveyContent';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

export const SurveyExample = (): JSX.Element => {
  const [ratings, setRatings] = useState(0);
  const [issuesSelected, setIssuesSelected] = useState<CallSurvey | undefined>();
  const [showSubmitFeedbackButton, setShowSubmitFeedbackButton] = useState(false);
  const [improvementSuggestions, setImprovementSuggestions] = useState<CallSurveyImprovementSuggestions>({});
  const [surveyResults, setSurveyResults] = useState<CallSurvey>({});
  const [showDefaultAfterSubmitScreen, setShowDefaultAfterSubmitScreen] = useState<boolean>(false);
  const [showDefaultAfterDismissedScreen, setShowDefaultAfterDismissedScreen] = useState<boolean>(false);

  const theme = useTheme();
  const questionTextStyle = (theme: Theme): string =>
    mergeStyles({
      fontWeight: 600,
      fontSize: '1.3rem',
      lineHeight: '1.3rem',
      color: theme.palette.neutralPrimary
    });
  return (
    <>
      {showDefaultAfterSubmitScreen && (
        <Stack>
          <Stack horizontal>
            <div>Overall: </div>
            <div>{`rating: ${surveyResults.overallRating?.score}, issues: ${surveyResults.overallRating?.issues}, improvement suggestions: ${improvementSuggestions.overallRating}`}</div>
          </Stack>
          <Stack horizontal>
            <div>Audio: </div>
            <div>{`rating: ${surveyResults.audioRating?.score ?? surveyResults.overallRating?.score}, issues: ${
              surveyResults.audioRating?.issues
            }, improvement suggestions: ${improvementSuggestions.audioRating}`}</div>
          </Stack>
          <Stack horizontal>
            <div>Video: </div>
            <div>{`rating: ${surveyResults.videoRating?.score ?? surveyResults.overallRating?.score}, issues: ${
              surveyResults.videoRating?.issues
            }, improvement suggestions: ${improvementSuggestions.videoRating}`}</div>
          </Stack>
          )
          <Stack horizontal>
            <div>ScreenShare: </div>
            <div>{`rating: ${surveyResults.screenshareRating?.score ?? surveyResults.overallRating?.score}, issues: ${
              surveyResults.screenshareRating?.issues
            }, improvement suggestions: ${improvementSuggestions.screenshareRating}`}</div>
          </Stack>
        </Stack>
      )}
      {showDefaultAfterDismissedScreen && <div>Sorry to see you go</div>}
      {!showDefaultAfterSubmitScreen && !showDefaultAfterDismissedScreen && (
        <Stack verticalAlign="center" style={{ width: '24rem' }}>
          <Text className={questionTextStyle(theme)}>Help us improve</Text>
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
            setImprovementSuggestions={(improvementSuggestions: CallSurveyImprovementSuggestions) => {
              setImprovementSuggestions(improvementSuggestions);
            }}
          />
          <Stack horizontal horizontalAlign="end">
            <PrimaryButton
              style={{ marginTop: '1rem', marginRight: '0.5rem' }}
              onClick={() => {
                setShowDefaultAfterDismissedScreen(true);
              }}
            >
              Skip
            </PrimaryButton>

            {showSubmitFeedbackButton && (
              <PrimaryButton
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
                  setSurveyResults(surveyResults);
                  setShowDefaultAfterSubmitScreen(true);
                }}
              >
                Confirm
              </PrimaryButton>
            )}
          </Stack>
        </Stack>
      )}
    </>
  );
};
