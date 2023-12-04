// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import { Text, useTheme, Stack, Checkbox, Pivot, PivotItem } from '@fluentui/react';
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
import { checkboxClassName, questionTextStyle, helperTextStyle } from './TagsSurvey.styles';
import {
  _AudioIssue,
  _CallSurvey,
  _CallSurveyResponse,
  _OverallIssue,
  _ScreenshareIssue,
  _VideoIssue
} from '../SurveyTypes';
import { SurveyIssues } from '../../../types';
/**
 * Strings of {@link TagsSurvey} that can be overridden.
 *
 * @internal
 */
export interface _TagsSurveyStrings {
  /**
   * Survey question
   */
  tagsSurveyQuestion?: string;
  /**
   * Confirm Button Label
   */
  tagsSurveyHelperText?: string;
}

/**
 *
 * @internal
 */
export type _IssueCategory = 'overallRating' | 'audioRating' | 'videoRating' | 'screenshareRating';
/**
 *
 * @internal
 */
export type _SurveyTag = {
  [issueCategory: string]: {
    message: string;
    issue: _AudioIssue | _OverallIssue | _ScreenshareIssue | _VideoIssue;
  }[];
};

/**
 * Props for {@link TagsSurvey} component.
 *
 * @internal
 */
export interface _TagsSurveyProps {
  /** Issues included in the survey */
  issues: (_AudioIssue | _OverallIssue | _ScreenshareIssue | _VideoIssue)[];
  /** Mappings from call issues to tags displayed on the survey*/
  callIssuesToTag: SurveyIssues;
  /** Function to send TagsSurvey results*/
  onConfirm?: (selectedTags: _CallSurvey) => void;
  /** Tags survey strings */
  strings?: _TagsSurveyStrings;
}

/**
 * A component to allow users to send numerical ratings regarding call quality
 *
 * @internal
 */
export const _TagsSurvey = (props: _TagsSurveyProps): JSX.Element => {
  const { issues, callIssuesToTag, onConfirm, strings } = props;

  const [selectedTags, setSelectedTags] = useState({});

  const tags: _SurveyTag[] = [];
  issues.map((issue) => {
    const issueCamelCase = issue?.charAt(0).toLowerCase() + issue?.slice(1);
    const issueCategory = Object.keys(callIssuesToTag).find(
      (key) => callIssuesToTag[key][issueCamelCase] !== undefined
    );
    if (issueCategory) {
      if (tags[issueCategory]) {
        tags[issueCategory].push({
          message: callIssuesToTag[issueCategory][issueCamelCase],
          issue: issue
        });
      } else {
        tags[issueCategory] = [
          {
            message: callIssuesToTag[issueCategory][issueCamelCase],
            issue: issue
          }
        ];
      }
    }
  });

  const onChange = React.useCallback(
    (issue: string, issueCategory: string, checked: boolean): void => {
      if (checked) {
        setSelectedTags((prevState) => {
          if (prevState[issueCategory]) {
            prevState[issueCategory].issues.push(issue);
          } else {
            prevState[issueCategory] = { score: 1, issues: [issue] };
          }
          return prevState;
        });
      } else {
        setSelectedTags((prevState) => {
          if (prevState[issueCategory]) {
            prevState[issueCategory].issues = prevState[issueCategory].issues.filter(function (value) {
              return value !== issue;
            });
            if (prevState[issueCategory].issues.length === 0) {
              delete prevState[issueCategory];
            }
          }
          return prevState;
        });
      }

      if (onConfirm) {
        onConfirm(selectedTags);
      }
    },
    [onConfirm, selectedTags]
  );

  const theme = useTheme();

  return (
    <>
      <Stack verticalAlign="center">
        <Text className={questionTextStyle(theme)}>{strings?.tagsSurveyQuestion}</Text>
        <Text className={helperTextStyle(theme)}>{strings?.tagsSurveyHelperText}</Text>
      </Stack>

      <Pivot>
        {Object.keys(tags).map((key, i) => {
          return (
            <PivotItem
              key={`key-${i}`}
              headerText={key}
              headerButtonProps={{
                'data-order': i,
                'data-title': key
              }}
              alwaysRender
            >
              {tags[key].map((t, i) => {
                return (
                  <Checkbox
                    className={checkboxClassName}
                    key={`checkBox_${i}`}
                    label={t.message}
                    onChange={(ev, checked) => onChange(t.issue, key, checked ?? false)}
                  />
                );
              })}
            </PivotItem>
          );
        })}
      </Pivot>
    </>
  );
};
