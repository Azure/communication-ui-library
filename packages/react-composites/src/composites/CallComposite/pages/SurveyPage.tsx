// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
import { CallSurvey } from '@azure/communication-calling';
/* @conditional-compile-remove(end-of-call-survey) */
import { useHandlers } from '../hooks/useHandlers';
/* @conditional-compile-remove(end-of-call-survey) */
import { Survey } from '../../common/Survey';
/* @conditional-compile-remove(end-of-call-survey) */
import { CallSurveyImprovementSuggestions } from '@internal/react-components';
/* @conditional-compile-remove(end-of-call-survey) */
import { IStyle, Stack, mergeStyles } from '@fluentui/react';
/* @conditional-compile-remove(end-of-call-survey) */
import { containerStyle } from '../styles/NetworkReconnectTile.styles';
/* @conditional-compile-remove(end-of-call-survey) */
import { containerItemGap } from '../styles/NoticePage.styles';

/**
 * @private
 */
export interface SurveyPageProps {
  /* @conditional-compile-remove(end-of-call-survey) */
  dataUiId: string;
  /* @conditional-compile-remove(end-of-call-survey) */
  pageStyle?: IStyle;
  /* @conditional-compile-remove(end-of-call-survey) */
  /**
   * Options for end of call survey
   */
  surveyOptions?: {
    /**
     * Disable call survey at the end of a call.
     * @defaultValue false
     */
    disableSurvey?: boolean;
    /* @conditional-compile-remove(end-of-call-survey-self-host) */
    /**
     * Optional callback to add extra logic when survey is dismissed. For self-host only
     */
    onSurveyDismissed?: () => void;
    /**
     * Optional callback to handle survey data including free form text response
     * Note that free form text response survey option is only going to be enabled when this callback is provided
     * User will need to handle all free form text response on their own
     */
    onSurveySubmitted?: (
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
  };
}

/**
 * Generic page with a title and more details text for serving up a notice to the user.
 *
 * @private
 */
export function SurveyPage(props: SurveyPageProps): JSX.Element {
  /* @conditional-compile-remove(end-of-call-survey) */
  const handlers = useHandlers(Survey);
  /* @conditional-compile-remove(end-of-call-survey) */
  return (
    <Stack
      className={mergeStyles(props.pageStyle)}
      verticalFill
      verticalAlign="center"
      horizontalAlign="center"
      data-ui-id={props.dataUiId}
      aria-atomic
    >
      <Stack className={mergeStyles(containerStyle)} tokens={containerItemGap}>
        <Survey
          {...handlers}
          onSurveySubmittedCustom={props.surveyOptions?.onSurveySubmitted}
          /* @conditional-compile-remove(end-of-call-survey-self-host) */
          onSurveyDismissed={props.surveyOptions?.onSurveyDismissed}
        />
      </Stack>
    </Stack>
  );

  return <></>;
}
