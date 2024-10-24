// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { CallSurvey } from '@azure/communication-calling';
import { useHandlers } from '../hooks/useHandlers';
import { Survey } from '../../common/Survey';
import { CallSurveyImprovementSuggestions } from '@internal/react-components';
import { Stack, mergeStyles } from '@fluentui/react';
import { containerStyle } from '../styles/NetworkReconnectTile.styles';
import { containerItemGap } from '../styles/NoticePage.styles';
import { CallCompositeIcons } from '../../common/icons';

/**
 * @private
 */
export interface SurveyPageProps {
  iconName?: keyof CallCompositeIcons;
  title: string;
  moreDetails?: string;
  dataUiId: string;
  disableStartCallButton?: boolean;
  mobileView?: boolean;

  /**
   * Options for end of call survey
   */
  surveyOptions?: {
    /**
     * Disable call survey at the end of a call.
     * @defaultValue false
     */
    disableSurvey?: boolean;
    /**
     * Optional callback to redirect users to custom screens when survey is done, note that default end call screen will be shown if this callback is not provided
     * This callback can be used to redirect users to different screens depending on survey state, whether it is submitted, skipped or has a problem when submitting the survey
     */
    onSurveyClosed?: (surveyState: 'sent' | 'skipped' | 'error', surveyError?: string) => void;
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
  const handlers = useHandlers(Survey);
  return (
    <Stack verticalFill verticalAlign="center" horizontalAlign="center" data-ui-id={props.dataUiId} aria-atomic>
      <Stack className={mergeStyles(containerStyle)} tokens={containerItemGap}>
        <Survey
          {...handlers}
          {...props}
          onSurveySubmittedCustom={props.surveyOptions?.onSurveySubmitted}
          onSurveyClosed={props.surveyOptions?.onSurveyClosed}
          isMobile={props.mobileView}
        />
      </Stack>
    </Stack>
  );
}
