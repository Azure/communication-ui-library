// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, useCallback } from 'react';
import { Text, useTheme, Stack, Modal, IconButton, PrimaryButton, DefaultButton, Checkbox } from '@fluentui/react';
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
import {
  buttonsContainerClassName,
  cancelButtonClassName,
  checkboxClassName,
  confirmButtonClassName,
  modalStyles,
  questionTextStyle,
  titleContainerClassName
} from './TagsSurvey.styles';
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
  TagsSurveyQuestion?: string;
  /**
   * Confirm Button Label
   */
  TagsSurveyConfirmButtonLabel?: string;
  /**
   * Confirm Button Label
   */
  TagsSurveyCancelButtonLabel?: string;
  /**
   * Aria Label for cancel button
   */
  cancelButtonAriaLabel?: string;
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
  message: string;
  issue: _AudioIssue | _OverallIssue | _ScreenshareIssue | _VideoIssue;
  issueCategory: _IssueCategory;
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
  onSubmitSurvey?: (survey: _CallSurvey) => Promise<_CallSurveyResponse | undefined>;
  /** Function to close star survey modal*/
  onDismissTagsSurvey?: () => void;
  /** Tags survey strings */
  strings?: _TagsSurveyStrings;
}

/**
 * A component to allow users to send numerical ratings regarding call quality
 *
 * @internal
 */
export const _TagsSurvey = (props: _TagsSurveyProps): JSX.Element => {
  const { issues, callIssuesToTag, onSubmitSurvey, onDismissTagsSurvey, strings } = props;

  const [selectedTags, setSelectedTags] = useState({});

  const tags: _SurveyTag[] = [];
// for survey issues, will need to change the first letter of the key to captitalized
//for example freeze to Freeze
// to do important! 
  issues.map((issue) => {
    const issueCategory: _IssueCategory = Object.keys(callIssuesToTag).find(
      (key) => callIssuesToTag[key][issue] !== undefined
    ) as _IssueCategory;
    if (issueCategory && callIssuesToTag[issueCategory][issue]) {
      tags.push({
        message: callIssuesToTag[issueCategory][issue],
        issue: issue,
        issueCategory: issueCategory
      });
    }
  });

  const onChange = React.useCallback((issue: string, issueCategory: string, checked: boolean): void => {
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
  }, []);

  const theme = useTheme();

  const onDismiss = useCallback((): void => {
    if (onDismissTagsSurvey) {
      onDismissTagsSurvey();
    }
  }, [onDismissTagsSurvey]);

  const onConfirm = useCallback(async (): Promise<void> => {
    if (onSubmitSurvey) {
      await onSubmitSurvey(selectedTags)
        .then(() => console.log('Survey Result submitted'))
        .catch((e) => console.log(e));
    }
    onDismiss();
  }, [onSubmitSurvey, onDismiss, selectedTags]);

  return (
    <Modal onDismissed={onDismiss} styles={modalStyles(theme)} isOpen>
      <Stack verticalAlign="center">
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className={titleContainerClassName}>
          <Text className={questionTextStyle(theme)}>{strings?.TagsSurveyQuestion}</Text>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            onClick={onDismiss}
            ariaLabel={strings?.cancelButtonAriaLabel}
            style={{ color: theme.palette.black }}
          />
        </Stack>
        {tags.map((t, i) => {
          return (
            <Checkbox
              className={checkboxClassName}
              key={`checkBox_${i}`}
              label={t.message}
              onChange={(ev, checked) => onChange(t.issue, t.issueCategory, checked ?? false)}
            />
          );
        })}
      </Stack>
      <Stack horizontal horizontalAlign="end" className={buttonsContainerClassName}>
        <PrimaryButton className={confirmButtonClassName} onClick={() => onConfirm()}>
          {strings?.TagsSurveyConfirmButtonLabel}
        </PrimaryButton>
        <DefaultButton className={cancelButtonClassName} onClick={() => onDismiss()}>
          {strings?.TagsSurveyCancelButtonLabel}
        </DefaultButton>
      </Stack>
    </Modal>
  );
};
