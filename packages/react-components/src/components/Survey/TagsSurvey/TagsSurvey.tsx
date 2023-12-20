// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useMemo, useState } from 'react';
import { Text, useTheme, Stack, Checkbox, Pivot, PivotItem, TextField } from '@fluentui/react';
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
import {
  checkboxClassName,
  questionTextStyle,
  helperTextStyle,
  freeFormTextFieldClassName,
  freeFormTextCheckboxStyles
} from './TagsSurvey.styles';
import {
  _AudioIssue,
  _CallSurvey,
  _CallSurveyResponse,
  _OverallIssue,
  _ScreenshareIssue,
  _VideoIssue
} from '../SurveyTypes';
import { SurveyIssuesHeadingStrings, SurveyIssues, CallSurveyImprovementSuggestions } from '../../../types';
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
   * Helper text for tag survey explaining what the survey is for
   */
  tagsSurveyHelperText?: string;
  /**
   * Default text for free form text field inside tags survey
   */
  tagsSurveyTextFieldDefaultText?: string;
}

/**
 * Survey Issue categories
 *
 * @internal
 */
export type _IssueCategory = 'overallRating' | 'audioRating' | 'videoRating' | 'screenshareRating';

/**
 * Key value pair of survey catogories and corresponding message/issue
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
  /** Mappings from call issues to tags displayed on the survey*/
  callIssuesToTag: SurveyIssues;
  /** Mappings from issue category to categories displayed on survey*/
  categoryHeadings: SurveyIssuesHeadingStrings;
  /** Function to send TagsSurvey results*/
  onConfirm?: (selectedTags: _CallSurvey, improvementSuggestions?: CallSurveyImprovementSuggestions) => void;
  /** show the text field for more info*/
  showFreeFormTextField?: boolean;
  /** Tags survey strings */
  strings?: _TagsSurveyStrings;
}

/**
 * A component to allow users to send numerical ratings regarding call quality
 *
 * @internal
 */
export const _TagsSurvey = (props: _TagsSurveyProps): JSX.Element => {
  const { callIssuesToTag, categoryHeadings, onConfirm, strings, showFreeFormTextField } = props;

  const [selectedTags, setSelectedTags] = useState({});

  const [textResponse, setTextResponse] = useState<CallSurveyImprovementSuggestions>({});

  const [selectedTextResponse, setSelectedTextResponse] = useState<CallSurveyImprovementSuggestions>({});

  const tags: _SurveyTag[] = useMemo(() => {
    const tags: _SurveyTag[] = [];
    Object.keys(callIssuesToTag).forEach((issueCategory) => {
      Object.keys(callIssuesToTag[issueCategory]).map((issue) => {
        const issueCapitalized = issue?.charAt(0).toUpperCase() + issue?.slice(1);

        if (tags[issueCategory]) {
          tags[issueCategory].push({
            message: callIssuesToTag[issueCategory][issue],
            issue: issueCapitalized
          });
        } else {
          tags[issueCategory] = [
            {
              message: callIssuesToTag[issueCategory][issue],
              issue: issueCapitalized
            }
          ];
        }
      });
    });
    return tags;
  }, [callIssuesToTag]);

  const onChange = React.useCallback(
    (issueCategory: string, checked: boolean, issue?: string): void => {
      if (checked) {
        if (issue) {
          setSelectedTags((prevState) => {
            if (prevState[issueCategory]) {
              prevState[issueCategory].issues.push(issue);
            } else {
              prevState[issueCategory] = { score: 1, issues: [issue] };
            }
            return prevState;
          });
        } else {
          setSelectedTextResponse((prevState) => {
            prevState[issueCategory] = textResponse[issueCategory];
            return prevState;
          });
        }
      } else {
        if (issue) {
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
        } else {
          setSelectedTextResponse((prevState) => {
            delete prevState[issueCategory];
            return prevState;
          });
        }
      }

      if (onConfirm) {
        onConfirm(selectedTags, selectedTextResponse);
      }
    },
    [onConfirm, selectedTags, selectedTextResponse, textResponse]
  );

  const theme = useTheme();

  const onRenderLabel = useCallback(
    (issueCategory) => {
      return (
        <TextField
          key={issueCategory}
          className={freeFormTextFieldClassName}
          underlined
          placeholder={strings?.tagsSurveyTextFieldDefaultText}
          onChange={(e, v) => {
            if (v) {
              setTextResponse((prevState) => {
                prevState[issueCategory] = v;
                return prevState;
              });

              setSelectedTextResponse((prevState) => {
                if (Object.keys(prevState).includes(issueCategory)) {
                  prevState[issueCategory] = v;
                }
                return prevState;
              });
            }
          }}
        />
      );
    },
    [strings?.tagsSurveyTextFieldDefaultText]
  );

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
              headerText={categoryHeadings[key]}
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
                    onChange={(ev, checked) => onChange(key, checked ?? false, t.issue)}
                  />
                );
              })}
              {showFreeFormTextField && (
                <Checkbox
                  styles={freeFormTextCheckboxStyles}
                  onChange={(ev, checked) => onChange(key, checked ?? false)}
                  onRenderLabel={() => {
                    return onRenderLabel(key);
                  }}
                />
              )}
            </PivotItem>
          );
        })}
      </Pivot>
    </>
  );
};
