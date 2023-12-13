// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { IStyle, mergeStyles, Stack, Text } from '@fluentui/react';
import {
  containerStyle,
  moreDetailsStyles,
  containerItemGap,
  titleStyles,
  rejoinCallButtonContainerStyles
} from '../styles/NoticePage.styles';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { StartCallButton } from '../components/StartCallButton';
import { CallCompositeIcon, CallCompositeIcons } from '../../common/icons';
/* @conditional-compile-remove(end-of-call-survey) */
import { CallSurvey } from '@azure/communication-calling';
/* @conditional-compile-remove(end-of-call-survey) */
import { useHandlers } from '../hooks/useHandlers';
/* @conditional-compile-remove(end-of-call-survey) */
import { SurveyPane } from '../../common/SurveyPane';

/**
 * @private
 */
export interface NoticePageProps {
  iconName?: keyof CallCompositeIcons;
  title: string;
  moreDetails?: string;
  dataUiId: string;
  disableStartCallButton?: boolean;
  pageStyle?: IStyle;
  /* @conditional-compile-remove(end-of-call-survey) */
  /**
   * Options for end of call survey
   */
  surveyOptions?: {
    /**
     * Hide call survey at the end of a call.
     * @defaultValue false
     */
    hideSurvey?: boolean;
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
       * This part of the result will always be send to calling sdk
       * This callback provides user with the ability to gain access to survey data
       */
      submittedSurvey: CallSurvey,
      /**
       * This is the survey results containing free form text
       * This part of the result will not be handled by composites
       * User will need to collect and handle this information 100% on their own
       * Free form text survey is not going to show in the UI if onSurveySubmitted is not populated
       */
      improvementSuggestions: {
        category: 'audio' | 'video' | 'screenshare';
        suggestion: string;
      }[]
    ) => Promise<void>;
  };
}

/**
 * Generic page with a title and more details text for serving up a notice to the user.
 *
 * @private
 */
export function NoticePage(props: NoticePageProps): JSX.Element {
  const adapter = useAdapter();

  /* @conditional-compile-remove(end-of-call-survey) */
  const handlers = useHandlers(SurveyPane);

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
        {props.iconName && <CallCompositeIcon iconName={props.iconName} />}
        <Text className={mergeStyles(titleStyles)} aria-live="assertive">
          {props.title}
        </Text>
        <Text className={mergeStyles(moreDetailsStyles)} aria-live="assertive">
          {props.moreDetails}
        </Text>
        {!props.disableStartCallButton && (
          <Stack styles={rejoinCallButtonContainerStyles}>
            <StartCallButton onClick={() => adapter.joinCall()} disabled={false} rejoinCall={true} autoFocus />
          </Stack>
        )}
      </Stack>
      {
        /* @conditional-compile-remove(end-of-call-survey) */ !props.surveyOptions?.hideSurvey && (
          <SurveyPane {...handlers} />
        )
      }
    </Stack>
  );
}
