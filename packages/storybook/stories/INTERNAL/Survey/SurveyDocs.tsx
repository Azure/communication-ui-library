// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const exampleOnSurveySubmitted = `
const onSurveySubmitted = (callId, surveyId, submittedSurvey, improvementSuggestions) => {
    // add your own logic for handling survey data here,
    //console log is a place holder and should be removed
    console.log(
      'call id is ',
      callId,
      'survey id is ',
      surveyId,
      'submitted survey data is',
      submittedSurvey,
      'improvement suggestions are',
      improvementSuggestions
    );
    return Promise.resolve();
  };

  const options: CallWithChatCompositeOptions = {
    surveyOptions: {
      onSurveySubmitted: onSurveySubmitted
    }
  };
`;

export const exampleOnSurveyClosed = `
const onSurveyClosed = (surveyState, surveyError) => {
    if (surveyState === 'sent') {
      //redirect to screen shown after survey is sent
    } else if (surveyState === 'skipped') {
      //redirect to screen shown after survey is skipped
    } else {
      //show error screen, surveyError prop contains the error message
    }
  };

  const options: CallWithChatCompositeOptions = {
    surveyOptions: {
      onSurveyClosed: onSurveyClosed
    }
  };
`;

export const exampleDisableSurvey = `
const options: CallWithChatCompositeOptions = {
    surveyOptions: {
        disableSurvey: true
    }
  };
`;
