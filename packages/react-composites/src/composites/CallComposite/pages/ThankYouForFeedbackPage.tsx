// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
import { mergeStyles, Stack, Text } from '@fluentui/react';
/* @conditional-compile-remove(end-of-call-survey) */
import { CallCompositeIcon, CallCompositeIcons } from '../../common/icons';
/* @conditional-compile-remove(end-of-call-survey) */
import { containerItemGap, containerStyle, titleStyles } from '../styles/NoticePage.styles';
/* @conditional-compile-remove(end-of-call-survey) */
import { useLocale } from '../../localization';

/* @conditional-compile-remove(end-of-call-survey) */
/**
 * @private
 */
export interface ThankYouForFeedbackPageProps {
  iconName?: keyof CallCompositeIcons;
}

/**
 * Page shown after the survey is submitted.
 * @private
 */
export function ThankYouForFeedbackPage(props: ThankYouForFeedbackPageProps): JSX.Element {
  /* @conditional-compile-remove(end-of-call-survey) */
  const strings = useLocale().strings.call;
  /* @conditional-compile-remove(end-of-call-survey) */
  return (
    <Stack verticalFill verticalAlign="center" horizontalAlign="center" data-ui-id={'thank-you-page'} aria-atomic>
      <Stack className={mergeStyles(containerStyle)} tokens={containerItemGap}>
        {props.iconName && <CallCompositeIcon iconName={props.iconName} />}
        <Text className={mergeStyles(titleStyles)} aria-live="assertive">
          {strings.endOfSurveyText}
        </Text>
      </Stack>
    </Stack>
  );
  return <></>;
}
