// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { mergeStyles, Stack, Text } from '@fluentui/react';
import { CallCompositeIcon, CallCompositeIcons } from '../../common/icons';
import { containerItemGap, containerStyle, titleStyles } from '../styles/NoticePage.styles';
import { useLocale } from '../../localization';

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
  const strings = useLocale().strings.call;
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
}
