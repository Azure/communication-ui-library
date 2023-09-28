// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(end-of-call-survey) */
import { useState } from 'react';
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
import { StarSurvey } from '../components/StarSurvey';
/* @conditional-compile-remove(end-of-call-survey) */
import { TagsSurvey } from '../components/TagsSurvey';
/* @conditional-compile-remove(end-of-call-survey) */
import { _AudioIssue, _OverallIssue, _ScreenshareIssue, _VideoIssue } from '@internal/react-components';

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
  survey?:boolean
}

/**
 * Generic page with a title and more details text for serving up a notice to the user.
 *
 * @private
 */
export function NoticePage(props: NoticePageProps): JSX.Element {
  const adapter = useAdapter();
  /* @conditional-compile-remove(end-of-call-survey) */
  const [showTagsSurvey, setShowTagsSurvey] = useState(false);
  /* @conditional-compile-remove(end-of-call-survey) */
  const onSubmitStarSurvey = (ratings: number): void => {
    if (ratings <= 3) {
      setShowTagsSurvey(true);
    }
  };
  /* @conditional-compile-remove(end-of-call-survey) */
  const issues: (_AudioIssue | _OverallIssue | _ScreenshareIssue | _VideoIssue)[] = [
    'NoLocalAudio',
    'NoRemoteAudio',
    'AudioNoise',
    'LowVolume',
    'CallCannotJoin',
    'CallCannotInvite'
  ];

  return (
    <Stack
      className={mergeStyles(props.pageStyle)}
      verticalFill
      verticalAlign="center"
      horizontalAlign="center"
      data-ui-id={props.dataUiId}
      aria-atomic
    >
      {/* @conditional-compile-remove(end-of-call-survey) */props.survey && <StarSurvey onSubmitStarSurvey={onSubmitStarSurvey} />}

      {/* @conditional-compile-remove(end-of-call-survey) */ props.survey &&showTagsSurvey && <TagsSurvey issues={issues} />}

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
    </Stack>
  );
}
