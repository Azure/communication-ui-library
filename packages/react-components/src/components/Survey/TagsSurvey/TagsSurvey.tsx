// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Permit `any` in this file to handle the overloaded issue type. Todo: refactor CallSurvey to have PartialDeep<_CallSurvey> instead of any
// for tracking incomplete survey responses.
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, useTheme, Stack, Checkbox, Pivot, PivotItem, TextField } from '@fluentui/react';
import { _formatString, _getKeys, _pxToRem } from '@internal/acs-ui-common';
import {
  checkboxClassName,
  questionTextStyle,
  helperTextStyle,
  freeFormTextFieldClassName,
  freeFormTextCheckboxStyles
} from './TagsSurvey.styles';
import {
  _AudioIssue,
  _CallRating,
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
export type _SurveyTag = Record<
  _IssueCategory,
  {
    message: string;
    issue: _AudioIssue | _OverallIssue | _ScreenshareIssue | _VideoIssue;
  }[]
>;

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

  const [selectedTags, setSelectedTags] = useState<_CallSurvey>({});

  const [textResponse, setTextResponse] = useState<CallSurveyImprovementSuggestions>({});

  const [selectedTextResponse, setSelectedTextResponse] = useState<CallSurveyImprovementSuggestions>({});

  const [checkedTextFields, setCheckedTextFields] = useState<_IssueCategory[]>([]);

  const tags: _SurveyTag = useMemo(() => {
    const tags: _SurveyTag = {
      overallRating: [],
      audioRating: [],
      videoRating: [],
      screenshareRating: []
    };
    _getKeys(callIssuesToTag).forEach((issueCategory) => {
      _getKeys(callIssuesToTag[issueCategory]).map((issue) => {
        const issueCapitalized = (issue?.charAt(0).toUpperCase() + issue?.slice(1)) as
          | _AudioIssue
          | _OverallIssue
          | _ScreenshareIssue
          | _VideoIssue;

        const issueMessages = callIssuesToTag[issueCategory];
        if (tags[issueCategory]) {
          tags[issueCategory].push({
            message: issueMessages[issue],
            issue: issueCapitalized
          });
        } else {
          tags[issueCategory] = [
            {
              message: issueMessages[issue],
              issue: issueCapitalized
            }
          ];
        }
      });
    });
    return tags;
  }, [callIssuesToTag]);

  const onChange = React.useCallback(
    (
      issueCategory: _IssueCategory,
      checked: boolean,
      issue?: _AudioIssue | _OverallIssue | _ScreenshareIssue | _VideoIssue
    ): void => {
      if (checked) {
        if (issue) {
          setSelectedTags((prevState) => {
            const category = prevState?.[issueCategory];
            if (category && category.issues) {
              category.issues = [category.issues, issue] as any;
            } else {
              prevState[issueCategory] = { issues: [issue] } as any;
            }
            return prevState;
          });
        } else {
          setCheckedTextFields([...checkedTextFields, issueCategory]);
          setSelectedTextResponse((prevState) => {
            prevState[issueCategory] = textResponse[issueCategory];
            return prevState;
          });
        }
      } else {
        if (issue) {
          setSelectedTags((prevState) => {
            // 'prevState[issueCategory]?.issues as ...' typing is required here to avoid a typescript limitation
            // "This expression is not callable" caused by filter().
            // More information can be found here: https://github.com/microsoft/TypeScript/issues/44373
            const categoryIssues = (
              prevState[issueCategory]?.issues as (_AudioIssue | _OverallIssue | _ScreenshareIssue | _VideoIssue)[]
            )?.filter((value: _AudioIssue | _OverallIssue | _ScreenshareIssue | _VideoIssue) => value !== issue);
            return {
              ...prevState,
              [issueCategory]: {
                ...(prevState[issueCategory] || {}),
                issues: categoryIssues
              }
            };
          });
        } else {
          setCheckedTextFields(checkedTextFields.filter((id) => id !== issueCategory));
          setSelectedTextResponse((prevState) => {
            delete prevState[issueCategory];
            return prevState;
          });
        }
      }
    },
    [textResponse, checkedTextFields]
  );

  const theme = useTheme();

  const onRenderLabel = useCallback(
    (issueCategory: _IssueCategory) => {
      return (
        <TextField
          key={issueCategory}
          className={freeFormTextFieldClassName}
          underlined
          placeholder={strings?.tagsSurveyTextFieldDefaultText}
          onChange={(e, v) => {
            if (v) {
              setCheckedTextFields([...checkedTextFields, issueCategory]);
              setTextResponse((prevState) => {
                prevState[issueCategory] = v;
                return prevState;
              });

              setSelectedTextResponse((prevState) => {
                prevState[issueCategory] = v;
                return prevState;
              });
            }
          }}
        />
      );
    },
    [strings?.tagsSurveyTextFieldDefaultText, checkedTextFields]
  );

  useEffect(() => {
    if (onConfirm) {
      onConfirm(selectedTags, selectedTextResponse);
    }
  }, [selectedTags, selectedTextResponse, onConfirm]);

  return (
    <>
      <Stack verticalAlign="center">
        <Text className={questionTextStyle(theme)}>{strings?.tagsSurveyQuestion}</Text>
      </Stack>

      <Pivot>
        {_getKeys(tags).map((key, i) => {
          return (
            <PivotItem
              key={`key-${i}`}
              headerText={categoryHeadings[key]} // Add index signature to allow indexing with a string
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
                  checked={checkedTextFields.includes(key)}
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

      <Text className={helperTextStyle(theme)}>{strings?.tagsSurveyHelperText}</Text>
    </>
  );
};
